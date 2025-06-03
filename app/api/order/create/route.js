import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Product from "@/models/product"
import User from "@/models/user"
import Order from "@/models/Order"
import { inngest } from "@/config/inngest"

export async function POST(request){
    try {
        await connectDB()

        const {userId} = getAuth(request)
        if (!userId) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401})
        }

        const { address, items, paymentMethod } = await request.json()

    if (!paymentMethod || !['esewa', 'khalti'].includes(paymentMethod)) {
      return NextResponse.json({ success: false, message: "Invalid payment method" }, { status: 400 })
    };
        if(!items || items.length === 0){
            return NextResponse.json({success: false, message: "No items in cart"}, {status: 400})
        }

        // Validate address
        if(!address || !address.fullName || !address.PhoneNumber || !address.area || !address.city || !address.province) {
            return NextResponse.json({success: false, message: "Complete address details are required"}, {status: 400})
        }

        // Find user first
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({success: false, message: "User not found"}, {status: 404})
        }

        // Get all available products
        const allProducts = await Product.find({}).sort({ date: -1 });
        
        // Map to store available products by ID for quick lookup
        const availableProducts = new Map();
        allProducts.forEach(product => {
            availableProducts.set(product._id.toString(), product);
        });

        // Validate items and map to available products
        const products = [];
        const missingProducts = [];

        for (const item of items) {
            const product = availableProducts.get(item.product);
            if (product) {
                products.push(product);
            } else {
                missingProducts.push(item.product);
            }
        }

        if (missingProducts.length > 0) {
            // Clear user's cart since it has invalid products
            user.cartItems = {};
            await user.save();

            return NextResponse.json({
                success: false, 
                message: `Your cart contains products that are no longer available. We've cleared your cart - please add available products and try again.`,
                missingProducts
            }, {status: 404});
        }

        // Calculate amount using reduce
        const amount = await items.reduce(async (acc, item) => {
            const product = products.find(p => p._id.toString() === item.product);
            return await acc + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        // Calculate tax and total amount
        const tax = Math.floor(amount * 0.02); // 2% tax
        const totalAmount = amount + tax;

        // Create order in database
        const order = await Order.create({
            userId: userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            amount: totalAmount,
            address: JSON.stringify({
                userId: userId,
                fullName: address.fullName,
                PhoneNumber: address.PhoneNumber,
                zipcode: address.zipcode,
                area: address.area,
                city: address.city,
                province: address.province
            }),
            status: 'Order Placed',
            amount,
            date: Date.now(),
            paymentMethod
        });

        // Create order event
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
                status: 'Order Placed'
            }
        })

        // Clear user cart
        user.cartItems = {}
        await user.save()

        return NextResponse.json({
            success: true, 
            message: "Order placed successfully",
            orderId: order._id,
            orderDetails: order
        })

    } catch(error) {
        console.error("Error creating order:", error)
        return NextResponse.json({
            success: false, 
            message: error.message || "Failed to create order"
        }, {status: 500})
    }
}
