import Address from "@/models/address"
import Product from "@/models/product"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"



export async function GET(request){
    try {
        const {userId} = getAuth(request)
        
        await connectDB()
        
        Address.length
        Product.length

        const orders = await Order.find({userId}).populate()
    } catch (error) {
        
    }
}
