import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import fetch from "node-fetch";

export async function POST(req){
    try{
        const {orderId,trackingNumber,courierCode} = await req.json();

        if(!orderId || !trackingNumber){  
            return NextResponse.json({error:"Missing Data"},{status:400});
        }

        await connectDB();

        const ship24Res = await fetch("https://api.ship24.com/public/v1/trackers/track",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${process.env.SHIP24_API_KEY}`,
            },
            body:JSON.stringify({
                trackingNumber,
                courierCode: courierCode ||  undefined,
            }),
        });

        const ship24Data = await ship24Res.json();


        await Order.findByIdAndUpdate(orderId,{
            trackingNumber,
            courierCode: courierCode || null,
            trackingProvider:"Ship24",
            status:"shipped",
        });

        return NextResponse.json({
            message:"Tracking added successfully",
            ship24Data,
        });
    }catch(err){
        // console.error("Error adding Tracker:",err);
        return NextResponse.json({error:"Server error"},{status:500});
    }

}