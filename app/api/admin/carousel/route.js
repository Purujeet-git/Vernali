import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";





export async function POST(req){
    try {
    await connectDB();
    const { imageUrl, redirectUrl, carouselSection } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ message: "Image URL is required" }, { status: 400 });
    }

    const slide = new Carousel({ imageUrl, redirectUrl, carouselSection });
    await slide.save();

    return NextResponse.json({ message: 'Slide added', slide }, { status: 201 });
  } catch (err) {
    // console.error("Error saving carousel slide:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req){
    await connectDB();
    const {id} = await req.json();
    
    await Carousel.findByIdAndDelete(id);
    return NextResponse.json({message:"Deleted successfully"});
}

