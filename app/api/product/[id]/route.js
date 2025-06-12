import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import React from "react";

export async function DELETE(request, { params }) {
    await connectDB();
    const { id } = params;
    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request, context) {
    await connectDB();
    const { id } = await context.params; // ✅ await params
    try {
        const formData = await request.formData();
        const updateData = {};
        for (const [key, value] of formData.entries()) {
            updateData[key] = value;
        }
        // Convert numeric fields
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.offerPrice) updateData.offerPrice = Number(updateData.offerPrice);
        if (updateData.shippingFee) updateData.shippingFee = Number(updateData.shippingFee);
        if (updateData.deliveryCharge) updateData.deliveryCharge = Number(updateData.deliveryCharge);
        if (updateData.stock) updateData.stock = Number(updateData.stock);

        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Product updated", product: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    await connectDB();
    const { id } = params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

<button
  onClick={() => openEditModal(product)}
  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Edit
</button>