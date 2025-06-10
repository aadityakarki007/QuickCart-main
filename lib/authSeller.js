import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authSeller = async (userId) => {
    try {
        const user = await clerkClient.users.getUser(userId);
        return user?.publicMetadata?.role === 'seller';
    } catch (error) {
        console.error("Error in authSeller:", error);
        return false;
    }
}

export default authSeller;