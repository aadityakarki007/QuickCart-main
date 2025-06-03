import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Address from "@/models/address"


export async function POST(request){
    try {

        const { userId } = getAuth(request)
        const {addressData} = await request.json()

        await connectDB()
        const newAddress = await Address.create({
            userId,
            fullName: addressData.fullName,
            PhoneNumber: addressData.phoneNumber,
            zipcode: addressData.zipcode,
            area: addressData.area,
            city: addressData.city,
            province: addressData.province
        })

        return NextResponse.json({success: true, message: "Address added successfully", newAddress})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message});
    }
}