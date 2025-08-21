import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function PUT(req, {params}) {
    try{
        await connectDB();
        const { id } = params;
        const body = await req.json();
        const { imageUrl } = body;

        if(!imageUrl) return NextResponse.json({error:"Slide not found"},{status:404});
        
        return NextResponse.json(updatedSlide, {status:200});

    }catch(err){
        // console.error("Error updating this file",err);
        return NextResponse.json({error:"Failed to update image"},{status:500});
    }
}