// Save this as: /app/api/orders/route.js (for App Router)
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { serializeMongoDoc } from "@/lib/serializeMongoDoc";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Processing';
    
    await connectDB();
    const ordersRaw = await Order.find({ orderStatus: status }).lean();
    const orders = ordersRaw.map(serializeMongoDoc);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' }, 
      { status: 500 }
    );
  }
}
