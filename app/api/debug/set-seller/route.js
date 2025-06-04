import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/user";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log('DEBUG SET-SELLER - User ID from Clerk:', userId);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Check all users in the database for debugging
    // @ts-ignore - Mongoose typing issue
    const allUsers = await User.find({}).lean().exec();
    console.log('DEBUG SET-SELLER - All users in DB:', JSON.stringify(allUsers));
    
    // Find or create user document
    // @ts-ignore - Mongoose typing issue
    let user = await User.findOne({ $or: [{ _id: userId }, { clerkId: userId }] }).exec();
    console.log('DEBUG SET-SELLER - Found user?', user ? 'Yes' : 'No');
    
    if (user) {
      // Update existing user
      console.log('DEBUG SET-SELLER - Updating existing user');
      user.isSeller = true;
      user.clerkId = userId;
      await user.save();
      console.log('DEBUG SET-SELLER - User updated with isSeller=true');
    } else {
      console.log('DEBUG SET-SELLER - Creating new user');
      // Get user data from URL parameters
      const url = new URL(request.url);
      const name = url.searchParams.get('name') || 'User';
      const email = url.searchParams.get('email') || 'user@example.com';
      
      // Create new user with seller privileges
      // @ts-ignore - Mongoose typing issue
      user = new User({
        _id: userId,
        clerkId: userId,
        name: name,
        email: email,
        isSeller: true,
        cartItems: {}
      });
      
      await user.save();
      console.log('DEBUG SET-SELLER - New user created with isSeller=true');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `User is now a seller`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller
      }
    });
  } catch (error) {
    console.error("Error setting seller status:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
