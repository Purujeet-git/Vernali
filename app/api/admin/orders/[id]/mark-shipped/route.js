import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const AFTERSHIP_API_KEY = process.env.AFTERSHIP_API_KEY;

export async function POST(req,{params}) {
    await connectDB();
    const orderId = params.id;
    const {trackingNumber,courierSlug } = await req.json();

    if(!trackingNumber || !courierSlug){
        return NextResponse.json({error:"Tracking info is required"},{status:400});
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            trackingNumber,
            courierSlug,
            status:"Shipped",
        },
        {new:true}
    );

    const aftershipRes = await fetch("https://api.aftership.com/v4/trackings",{
        method:"POST",
        headers:{
            "aftership-api-key":AFTERSHIP_API_KEY,
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            tracking:{
                tracking_number:trackingNumber,
                slug:courierSlug,
            },
        }),
    });

    const data = await aftershipRes.json();

    if(aftershipRes.status !== 201 && aftershipRes.status !== 200){
        return NextResponse.json({error:"Failed to register tracking",data},{status:500});
    }

    return NextResponse.json({success:true,order});
}