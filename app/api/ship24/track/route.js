import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const {trackingNumber,courierSlug} = await request.json();

        if(!trackingNumber ){
            return NextResponse.json(
                {error:"Tracking number is required"},
                {status:400}
            );
        }

        const res = await fetch(`https://api.ship24.com/public/v1/trackers`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${process.env.SHIP24_API_KEY}`,
            },
            body:JSON.stringify({
                trackingNumber,
                courierCode: courierSlug || undefined,
            }),
        });

        const data = await res.json();

        if(!res.ok){
            return NextResponse.json({error:data},{status:res.status});
        }

        return NextResponse.json(data);
    }
    catch(err){
        // console.error("Ship24 API error:",err);
        return NextResponse.json(
            {error:"Something went wrong"},
            {status:500}
        );
    }
}