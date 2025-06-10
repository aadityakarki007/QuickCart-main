import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log('DEBUG SET-SELLER - User ID from Clerk:', userId);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Update user's metadata in Clerk to set them as a seller
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: 'seller' }
    });

    console.log('DEBUG SET-SELLER - Updated user metadata:', user.publicMetadata);

    return NextResponse.json({ 
      success: true, 
      message: `User is now a seller`,
      user: {
        id: user.id,
        role: user.publicMetadata.role
      }
    });
  } catch (error) {
    console.error("Error setting seller status:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
