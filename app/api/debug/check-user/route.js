import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const auth = getAuth(request);
    const userId = auth.userId;
    const userEmail = auth.sessionClaims?.email;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    // Direct MongoDB collection access
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find all users and log them
    const allUsers = await usersCollection.find({}).toArray();
    console.log('CHECK USER - All users in DB:', JSON.stringify(allUsers, null, 2));
    
    // Find the specific user by clerkId since it's a string
    const userByClerkId = await usersCollection.findOne({ clerkId: userId });
    console.log('CHECK USER - User by clerkId:', JSON.stringify(userByClerkId, null, 2));
    
    // Try to update existing user first
    const updateResult = await usersCollection.updateOne(
        { clerkId: userId },
        { 
            $set: { 
                isSeller: true
            },
            $setOnInsert: {
                name: typeof userEmail === 'string' ? userEmail.split('@')[0] : 'New Seller',
                email: typeof userEmail === 'string' ? userEmail : `seller-${userId}@example.com`,
                cartItems: {}
            }
        },
        { upsert: true } // Create if doesn't exist
    );
    console.log('CHECK USER - Update/Insert result:', updateResult);
    
    // Get the user (it must exist now)
    const user = await usersCollection.findOne({ clerkId: userId });
    console.log('CHECK USER - User:', JSON.stringify(user, null, 2));
    
    if (!user) {
        // This should never happen due to upsert, but just in case
        console.error('CHECK USER - Failed to create/find user after upsert');
        return NextResponse.json({ 
            success: false,
            message: "Failed to create/find user"
        }, { status: 500 });
    }
    
    return NextResponse.json({ 
        success: true,
        message: updateResult.upsertedCount > 0 ? "New user created" : "User found and updated",
        user: user,
        updateResult: updateResult
    });
  } catch (error) {
    console.error('CHECK USER - Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
