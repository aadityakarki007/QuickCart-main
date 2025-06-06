import User from "@/models/user";
import connectDB from "@/config/db";

const authSeller = async (userId) => {
    if (!userId) return false;
    
    try {
        await connectDB();
        // @ts-ignore - Mongoose typing issue
        const user = await User.findOne({ 
            $or: [
                { _id: userId },
                { clerkId: userId }
            ]
        }).exec();

        return  true;
    } catch (error) {
        console.error("Auth seller error:", error);
        return false;
    }
};

export default authSeller;