import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function PUT(req) {
    try{
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();
        const { imageUrl } = body;

        if(!id || !imageUrl){
            return NextResponse.json({error:"Missing ID or imageUrl"},{status:400});
        }

        await Carousel.findByIdAndUpdate(id, { imageUrl },{new:true});

        return NextResponse.json({success:true});
    }catch(err){
        // console.error("Error updating image:",err);
        return NextResponse.json({error:"Update failed"},{ status: 500 });
    }
}