import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function DELETE(request, { params }) {
    await connectDB();
    const { id } = params;
    try {
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}