import connectDB from "@/lib/mongodb";
import Visitors from "@/models/Visitors";
import { NextResponse } from "next/server";

export async function POST(req){
    await connectDB();

    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("host") || "unknown";

    const body = await req.json();

    try{
        await Visitors.create({
            page:body.page || "unknown",
            userAgent,
            ip,
        });

        return NextResponse.json({success:true});
    }catch(error){
        // console.error("Visitor tracking error:",error);
        return NextResponse.json({success:false,message:"Failed to track visitors"});
    }
}