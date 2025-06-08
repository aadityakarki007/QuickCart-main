import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/user";

export async function GET(request) {
  try {
    // Get the specific user ID from the logs
    const userId = 'user_2xvxJa1ulo6EGwwttZxlTnZvDex';
    
    await connectDB();
    
    // Log all users first for debugging
    // @ts-ignore - Mongoose typing issue
    const allUsers = await User.find({}).lean().exec();
    console.log('FORCE SELLER DEBUG - All users:', JSON.stringify(allUsers));
    
    // Find the user directly by ID
    // @ts-ignore - Mongoose typing issue
    let user = await User.findById(userId).exec();
    
    if (user) {
      console.log('FORCE SELLER DEBUG - Found existing user, updating...');
      user.isSeller = true;
      user.clerkId = userId;
      await user.save();
    } else {
      console.log('FORCE SELLER DEBUG - User not found, creating new user with seller privileges');
      // @ts-ignore - Mongoose typing issue
      user = new User({
        _id: userId,
        clerkId: userId,
        name: 'Seller User',
        email: `seller-${userId}@example.com`,
        isSeller: true,
        cartItems: {}
      });
      
      await user.save();
    }
    
    // Verify the update worked
    // @ts-ignore - Mongoose typing issue
    const verifyUser = await User.findById(userId).lean().exec();
    console.log('FORCE SELLER DEBUG - Verification after update:', JSON.stringify(verifyUser));
    
    return NextResponse.json({ 
      success: true, 
      message: `User is now a seller`,
      user: verifyUser
    });
  } catch (error) {
    console.error("Error setting seller status:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
