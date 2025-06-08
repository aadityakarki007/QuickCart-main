import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

/** @type {import('mongoose').Model<any>} */
const ProductModel = Product;

export async function GET(request) {
    try {
        await connectDB();
        
        // Get URL parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 20;
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        
        // Build query
        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query and count in parallel
        const [products, total] = await Promise.all([
            ProductModel.find(query)
                .select('name price images description category brand offerPrice isPopular deliveryDate sellerId sellerName')
                .sort({ date: -1 }) 
                .skip((page - 1) * limit) // 
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        const result = {
            success: true,
            products,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                hasMore: (page - 1) * limit + products.length < total
            }
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to fetch products'
        }, { status: 500 });
    }
}
