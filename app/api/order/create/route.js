import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Product from "@/models/product"
import User from "@/models/user"
import Order from "@/models/Order"
import { inngest } from "@/config/inngest"

export async function POST(request) {
    try {
        await connectDB()

        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { address, items } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No items in cart" }, { status: 400 })
        }

        if (
            !address || !address.fullName || !address.PhoneNumber ||
            !address.area || !address.city || !address.province
        ) {
            return NextResponse.json({ success: false, message: "Complete address details are required" }, { status: 400 })
        }

        // Find user
        const user = await User.findOne({ clerkId: userId }).exec();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        // Fetch all products
        const allProducts = await Product.find({}).sort({ date: -1 }).exec()

        // Store in map
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

        const amount = items.reduce((acc, item) => {
            const product = products.find(p => p._id.toString() === item.product)
            return acc + (product.offerPrice || product.price) * item.quantity
        }, 0)

        const tax = Math.floor(amount * 0.02)
        const totalAmount = amount + tax

        const order = new Order({
            userId: userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            totalAmount,
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
            paymentMethod: "Cash on Delivery" // Hardcoded
        })

        // ✅ Save the order to MongoDB
        await order.save()

        // Fire event to Inngest
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
                tax,
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
