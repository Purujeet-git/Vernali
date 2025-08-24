import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export async function DELETE(req) {
    try {
        // Ensure MongoDB connection
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Missing ID parameter" }, 
                { status: 400 }
            );
        }

        const deletedItem = await Carousel.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return NextResponse.json(
                { error: "Item not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Item deleted successfully" }, 
            { status: 200 }
        );
        
    } catch (err) {
        console.error("Error deleting carousel item:", err);
        return NextResponse.json(
            { error: "Failed to delete item", details: err.message }, 
            { status: 500 }
        );
    }
}