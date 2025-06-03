import { authSeller } from "@/lib/auth";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Address from "@/models/address";


export async function GET(request){
    try {
        const {userId} = getAuth(request)

        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({success: false, message: "Not authorized as seller"}, {status: 403})
        }

        await connectDB()
         Address.length

        const orders = await Order.find({}).populate('items.product')
        return NextResponse.json({success: true, orders})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}