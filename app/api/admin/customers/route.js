import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {

    
    try{
        await connectDB();

        const customers = await User.find({role:"user"}).select(
            "firstName lastName email phone createdAt"
        );

        return NextResponse.json({success:true,customers});
    }catch(err){
        // console.error("Error fetching customers:",err);
        return NextResponse.json({success:false,error:"Server Error"},{status:500});
    }
}