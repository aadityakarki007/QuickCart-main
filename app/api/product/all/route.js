import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
    try {
        // Get authorization header from request
        const authHeader = await request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: "No authorization token" }, { status: 401 });
        }
        
        // Extract token and get userId from auth
        const token = authHeader.split(' ')[1];
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Connect to database
        await connectDB();

        // Get all products
        const products = await Product.aggregate([
            {
                $project: {
                    __v: 0
                }
            },
            {
                $sort: {
                    date: -1
                }
            }
        ]);

        return NextResponse.json({ 
            success: true, 
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.error("Error fetching all products:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "An error occurred while fetching products" 
        }, { status: 500 });
    }
}
