import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    // console.log("Incoming email:",email);
    try {
        const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
        // console.log("Fetched Orders:",orders);
        return NextResponse.json(orders);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
