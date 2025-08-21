import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Orders from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    // console.log("Razorpay Key ID being used:", process.env.RAZORPAY_KEY_ID);
    const body = await req.json();
    const { items, userEmail,name,phone,address,email } = body;

    if (!items || items.length === 0) {
        return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
        );
    
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = body;

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }



    const options = {
        amount: totalAmount * 100, 
        currency: "INR",
        receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    try {
        const order = await razorpay.orders.create(options);

        await Orders.create({
            userEmail,
            items,
            totalAmount,
            name,
            phone,
            address,
            email,
            orderId: order.id,
            status: "Pending",
        });

        return NextResponse.json(order, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}