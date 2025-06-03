import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Product from "@/models/product"
import { inngest } from "@/config/inngest"



export async function POST(request){
    try{
        const {userId} = getAuth(request)
        const { address, items } = await request.json();

        if(!userId || items.length == 0){
            return NextResponse.json({success: false, message: "Invalid data"}, {status: 401})
        }

        // calculate amount using items
        const amount= await items.reduce(async (accessedDynamicData, item)=> {
            const product = await Product.findById(item.product);
            return acc + product.offerPrice * item.quantity;

           
        },0)
        
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.2),
                date: Date.now()
            }
        })

        //clear user cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({success: true, message: "Order placed"})
        
        await connectDB()

        
    } catch(error){
        console.log(error)
        return NextResponse.json({success: false, message: error.message})
    }
}