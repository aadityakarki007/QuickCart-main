
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {
    try {
      
        await connectDB();
        // Get all products instead of filtering by userId
        const products = await Product.find({}).sort({ date: -1 })

        return NextResponse.json({ success: true, products })
    } catch (error) {

        return NextResponse.json({ success: false, error: error.message })
    }

}
