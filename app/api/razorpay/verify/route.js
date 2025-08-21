  import Orders from "@/models/Order";
  import connectDB from "@/lib/mongodb";
  import crypto from "crypto";
  import { NextResponse } from "next/server";

  export async function POST(req) {
    await connectDB();


    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay credentials" }, { status: 400 });
    }


    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");


    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }
    
    if (expectedSignature === razorpay_signature) {
      await Orders.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          status: "Paid",
        }
      );

      return NextResponse.json({success:true},{status:200});
    }

    return NextResponse.json({success:false},{status:400});
  }
