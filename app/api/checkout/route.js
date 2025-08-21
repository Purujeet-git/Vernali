import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Save Order to MongoDB (paymentSuccess: false)
    const newOrder = new Order({
      items: body.items, // Array of products
      totalAmount: body.totalAmount,
      name: body.name,
      phone: body.phone,
      address: body.address,
      userEmail: body.userEmail,
      paymentSuccess: false,
      orderStatus: 'Pending',
    });

    await newOrder.save();

    // 2. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: body.totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: newOrder._id.toString(),
      payment_capture: 1,
    });

    // 3. Return Razorpay order details to frontend
    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: newOrder._id,
    });

  } catch (err) {
    // console.error(err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
