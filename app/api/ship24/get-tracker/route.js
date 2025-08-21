import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(req){
    try{
        const {searchParams} = new URL(req.url);
        const trackingNumber = searchParams.get("trackingNumber");

        if(!trackingNumber){
            return NextResponse.json({error:"Missing tracking number"},{status:400});
        }

        const res = await fetch(`https://api.ship24.com/public/v1/trackers/${trackingNumber}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${process.env.SHIP24_API_KEY}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data);
    }
    catch(err){
        // console.error("Error fetching Tracking:",err);
        return NextResponse.json({error:"Server error"},{status:500});
    }
}