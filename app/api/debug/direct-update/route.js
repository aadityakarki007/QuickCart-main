import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();
    
    // Get the specific user ID from the logs
    const userId = 'user_2xvxJa1ulo6EGwwttZxlTnZvDex';
    
    // Direct MongoDB collection access to bypass Mongoose schema validation
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // First check if the user exists by clerkId
    const existingUser = await usersCollection.findOne({ clerkId: userId });
    console.log('DIRECT UPDATE - Existing user:', existingUser);
    
    // Update the user document directly using clerkId
    const result = await usersCollection.updateOne(
      { clerkId: userId },
      { 
        $set: { 
          isSeller: true
        } 
      },
      { upsert: true } // Create if doesn't exist
    );
    
    // Verify the update worked
    const updatedUser = await usersCollection.findOne({ clerkId: userId });
    console.log('DIRECT UPDATE - Updated user:', updatedUser);
    
    return NextResponse.json({ 
      success: true, 
      message: `User is now a seller`,
      updateResult: result,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error in direct update:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
