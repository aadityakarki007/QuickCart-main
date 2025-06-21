import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function PUT(req) {
  try {
    await connectDB();
    const { productId, isPopular } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { isPopular: !!isPopular },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isPopular ? "Marked as popular" : "Unmarked as popular",
      product,
    });
  } catch (error) {
    console.error("Error updating popular status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update popular status" },
      { status: 500 }
    );
  }
}