import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

/** @type {import('mongoose').Model<any>} */
const ProductModel = Product;

export async function GET(request) {
    try {
        await connectDB();

        const products = await ProductModel.find({}).sort({ date: -1 }).lean();

        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
