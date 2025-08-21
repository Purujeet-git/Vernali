import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function DELETE(req) {
    try{
        await connectDB();
        const { searchParams }  = new URL(req.url);
        const id = searchParams.get('id');

        if(!id) {
            return NextResponse.json({error:"missing ID"},{status:400});
        }

        await Carousel.findByIdAndDelete(id);
        return NextResponse.json({success:true},{status:200});
    }catch(err){
        // console.error("Error deleting carousel item:",err);
        return NextResponse.json({error:"FAiled to delete"},{status:500});
    }
}