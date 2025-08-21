import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function DELETE(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id  = searchParams.get("id");

    if(!id){
        return NextResponse.json({success:false,message:"No ID provided"},{status:400});
    }

    try{
        await Carousel.findByIdAndDelete(id);
        return NextResponse.json({success: true,message:"Deleted from DB"});
    }catch(err){
        // console.error("DB Deletion Error:",error);
        return NextResponse.json({success:false,message:"DB Error"},{status:500});
    }
}
