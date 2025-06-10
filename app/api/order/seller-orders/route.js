import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/product";
import Address from "@/models/address";

export async function GET(request) {
    try {
        // Get auth info from Clerk
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({
                success: false, 
                message: "Not authenticated"
            }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        
        if (!isSeller) {
            console.error("User not authorized as seller:", userId);
            return NextResponse.json({
                success: false, 
                message: "Not authorized as seller. Please ensure you have seller privileges."
            }, { status: 403 });
        }

        await connectDB();

        // First, get all products by this seller
        // @ts-ignore - Mongoose typing issue
        const sellerProducts = await Product.find({ userId }).lean().exec();
        const sellerProductIds = sellerProducts.map(product => product._id.toString());

        // Then fetch all orders
        // @ts-ignore - Mongoose typing issue
        const allOrders = await Order.find({})
            .populate('items.product')
            .lean()
            .exec();
        
        // Filter orders to only include those with products from this seller
        const orders = allOrders.filter(order => {
            return order.items.some(item => {
                // Check if this item's product belongs to the seller
                const productId = item.product?._id?.toString();
                return sellerProductIds.includes(productId);
            });
        });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error in seller-orders:", error);
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}