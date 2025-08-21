import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const AFTERSHIP_API_KEY= process.env.AFTERSHIP_API_KEY;

export async function POST(req){
    await connectDB();
    const {orderId,newStatus, trackingNumber,courierSlug} = await req.json();


    if(!orderId || !newStatus){
        return NextResponse.json({error:"Missing  required fields"},{status:400});
    }

    const updateFields = {orderStatus:newStatus};

    if(newStatus === 'delivered'){
        updateFields.deliveredAt = new Date();
    }

    if(newStatus === 'Shipped'){
        if(!trackingNumber || !courierSlug){
            return NextResponse.json({error:'Tracking number and courier slug is required'},{status:400});
        }

        updateFields.trackingNumber = trackingNumber;
        updateFields.courierSlug = courierSlug;

        await fetch('https://api.aftership.com/v4/trackings',{
            method:'POST',
            headers:{
                'aftership-api-key':AFTERSHIP_API_KEY,
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                tracking:{
                    tracking_number:trackingNumber,
                    slug:courierSlug,
                },
            }),
        });
    }

    const updateOrder = await Order.findByIdAndUpdate(orderId,updateFields,{new:true});

    return NextResponse.json({success:true,updateOrder});
    
}