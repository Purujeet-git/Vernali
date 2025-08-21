import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function  POST(req) {
    try{
        const {url} = await req.json();

        if(!url) return NextResponse.json({error:"Missing blob url"},{status:400});


        const path =  new URL(url).pathname.slice(1);

        await del(path);

        return NextResponse.json({success:true},{status:200});
    }catch(err){
        // console.error("Failed to delete blob:",err);
        return NextResponse.json({error:"Failed to delete blob"},{status:500});
    }
}