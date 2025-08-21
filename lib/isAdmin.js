import User from "@/models/User";
import connectDB from "./mongodb";

export async function isAdmin(email){
    await connectDB();
    const user = await User.findOne({email});
    return user?.role === 'admin';
}