import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
    try {
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Connect to database and fetch products
        await connectDB();
        const products = await Product.find({ userId }).sort({ date: -1 });

        return NextResponse.json({ success: true, products })
    } catch (error) {
        console.error("Error fetching seller products:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "An error occurred while fetching products" 
        }, { status: 500 });
    }
}