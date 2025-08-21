import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function GET(req){
    try{
        await connectDB();
        const {searchParams} = new URL(req.url);
        const section = searchParams.get('section');

        const query = section ? {carouselSection:section}:{};
        const slides = await Carousel.find(query).sort({createdAt:-1});

        return NextResponse.json(slides);
    }catch(err){
        // console.error("Error Fetching carousel slides:",err);
        {status:500};
    }
}