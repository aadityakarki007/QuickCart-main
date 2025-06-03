import User from "@/models/user";
import connectDB from "@/config/db";

export async function authSeller(userId) {
    if (!userId) return false;
    
    try {
        await connectDB();
        const user = await User.findOne({ clerkId: userId });
        return user?.isSeller || false;
    } catch (error) {
        console.error("Error in authSeller:", error);
        return false;
    }
}
