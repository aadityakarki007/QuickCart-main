import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/product";

export async function GET(request) {
    try {
        console.log("🚀 API Route: seller-orders called");
        
        // Get auth info from Clerk
        const { userId } = getAuth(request);
        console.log("👤 User ID from Clerk:", userId);
       
        if (!userId) {
            console.log("❌ No userId found");
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        console.log("🔌 Connecting to database...");
        await connectDB();

        // Fetch all orders and populate items.product
        console.log("📋 Fetching all orders...");
        const allOrders = await Order.find({})
            .populate({
                path: "items.product",
                model: Product
            })
            .lean()
            .exec();
        
        console.log("📋 Total orders in database:", allOrders.length);
        
        // Debug: Log first order structure
        if (allOrders.length > 0) {
            console.log("📋 Sample order structure:", {
                _id: allOrders[0]._id,
                items: allOrders[0].items?.map(item => ({
                    productId: item.product?._id?.toString(),
                    productName: item.product?.name,
                    quantity: item.quantity
                })),
                date: allOrders[0].date,
                amount: allOrders[0].amount
            });
        }
        console.log("Fetched orders:", allOrders.length, allOrders[0]);
        // Filter orders: keep orders where any item.product.userId === seller's userId
        const sellerOrders = allOrders.filter(order =>
            order.items.some(item =>
                item.product && (
                  item.product.userId === userId || // if populated
                  item.product === userId           // fallback if not populated
                )
            )
        );

        console.log("🎯 Filtered orders for seller:", sellerOrders.length);
        console.log("🎯 Order IDs:", sellerOrders.map(o => o._id.toString()));

        // Additional debugging - check if orders have proper structure
        if (sellerOrders.length > 0) {
            console.log("📋 First filtered order:", {
                _id: sellerOrders[0]._id,
                items: sellerOrders[0].items?.length,
                amount: sellerOrders[0].amount,
                date: sellerOrders[0].date,
                address: sellerOrders[0].address
            });
        }

        return NextResponse.json({ 
            success: true, 
            orders: sellerOrders,
            debug: {
                userId,
                totalOrdersCount: allOrders.length,
                filteredOrdersCount: sellerOrders.length
            }
        });

    } catch (error) {
        console.error("💥 Error in seller-orders:", error);
        console.error("💥 Error stack:", error.stack);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}