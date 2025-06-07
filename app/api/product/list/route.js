import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import mcache from 'memory-cache';

/** @type {import('mongoose').Model<any>} */
const ProductModel = Product;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEFAULT_PAGE_SIZE = 20;

export async function GET(request) {
    try {
        // Use URL from request object
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        
        // Set response headers for caching
        const headers = {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            'Content-Type': 'application/json',
        };

        // Create cache key based on query parameters
        const cacheKey = `products_${page}_${limit}_${category || ''}_${search || ''}`;
        const cached = mcache.get(cacheKey);
        if (cached) {
            console.log('Returning cached result for:', cacheKey);
            return NextResponse.json(cached);
        }

        console.log('Connecting to database...');
        await connectDB();
        console.log('Database connected');

        // Build query
        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        console.log('Executing query:', JSON.stringify(query));
        console.log('Skip:', (page - 1) * limit);
        console.log('Limit:', limit);

        // Execute query and count in parallel
        const [products, total] = await Promise.all([
            ProductModel.find(query)
                .select('name price images description category brand offerPrice isPopular deliveryDate sellerId sellerName') // Include all needed fields
                .sort({ date: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        console.log('Query executed - Products found:', products.length);
        console.log('Total documents:', total);

        const result = {
            success: true,
            products,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                hasMore: (page - 1) * limit + products.length < total
            }
        };

        // Cache the result
        mcache.put(cacheKey, result, CACHE_DURATION);
        console.log('Result cached with key:', cacheKey);

        return NextResponse.json(result, { headers });
    } catch (error) {
        console.error('Product list error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Failed to fetch products'
        }, { headers : { 'Content-Type': 'application/json' } });   
    }
}
