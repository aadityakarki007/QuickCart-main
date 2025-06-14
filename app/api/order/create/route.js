import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Product from "@/models/product"
import User from "@/models/user"
import Order from "@/models/Order"
import { inngest } from "@/config/inngest"
import UsedPromoCode from "@/models/UsedPromoCode" // <-- Add this import

export async function POST(request) {
    try {
        await connectDB()

        // Use auth() instead of getAuth() for Next.js 15 compatibility
        const authResult = await auth()
        console.log("Auth result:", authResult);
        
        const { userId } = authResult
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { address, items, amount, totalAmount, promoCode, discount, discountPercentage } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No items in cart" }, { status: 400 })
        }

        if (
            !address || !address.fullName || !address.PhoneNumber ||
            !address.area || !address.city || !address.province
        ) {
            return NextResponse.json({ success: false, message: "Complete address details are required" }, { status: 400 })
        }

        // Find user with debugging
        console.log("Looking for user with clerkId:", userId);
        let user = await User.findOne({ clerkId: userId }).exec();
        if (!user) user = await User.findOne({ clerk_id: userId }).exec();
        if (!user) user = await User.findOne({ userId: userId }).exec();
        if (!user) user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            const allUsers = await User.find({}).limit(5).exec();
            console.log("Sample users in database:", allUsers.map(u => ({ 
                id: u._id, 
                clerkId: u.clerkId, 
                clerk_id: u.clerk_id, 
                userId: u.userId 
            })));
            return NextResponse.json({ 
                success: false, 
                message: "User not found. Please ensure you're logged in and your account is properly set up.",
                debug: { 
                    searchedUserId: userId,
                    userCount: allUsers.length,
                    suggestion: "User might need to be created in the database first"
                }
            }, { status: 404 })
        }
        console.log("Found user:", { id: user._id, clerkId: user.clerkId });

        // Promo code logic: check and mark as used
        if (promoCode) {
            const alreadyUsed = await UsedPromoCode.findOne({ code: promoCode });
            if (alreadyUsed) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Promo code has already been used" 
                }, { status: 400 });
            }
            await UsedPromoCode.create({
                code: promoCode,
                usedBy: userId,
                usedAt: new Date()
            });
        }

        // Fetch all products
        const allProducts = await Product.find({}).sort({ date: -1 }).exec()
        const availableProducts = new Map()
        allProducts.forEach(product => {
            availableProducts.set(product._id.toString(), product)
        })

        const products = []
        const missingProducts = []

        for (const item of items) {
            const product = availableProducts.get(item.product)
            if (product) {
                products.push(product)
            } else {
                missingProducts.push(item.product)
            }
        }

        if (missingProducts.length > 0) {
            user.cartItems = {}
            await user.save()
            return NextResponse.json({
                success: false,
                message: `Your cart contains products that are no longer available. We've cleared your cart - please add available products and try again.`,
                missingProducts
            }, { status: 404 })
        }

        const order = new Order({
            userId: userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            amount,
            totalAmount,
            promoCode: promoCode || null,
            discount: discount || 0,
            discountPercentage: discountPercentage || 0,
            address: {
                userId: userId,
                fullName: address.fullName,
                PhoneNumber: address.PhoneNumber,
                zipcode: address.zipcode,
                area: address.area,
                city: address.city,
                province: address.province
            },
            status: 'Order Placed',
            date: Date.now(),
            paymentMethod: "Cash on Delivery"
        })

        await order.save()

        await inngest.send({
            name: "order/created",
            data: {
                orderId: order._id,
                userId,
                items: items.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                })),
                amount: totalAmount,
                address,
                status: 'Order Placed',
                paymentMethod: "Cash on Delivery"
            }
        })

        user.cartItems = {}
        await user.save()

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id,
            orderDetails: order
        })

    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to create order"
        }, { status: 500 })
    }
}