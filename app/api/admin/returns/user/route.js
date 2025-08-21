import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { NextResponse } from "next/server";

export async function GET(req){
    await connectDB();

    try{
        const {searchParams} = new URL(req.url);
        const email = searchParams.get('email');

        if(!email){
            return NextResponse.json({error:'Email Required'},{status:400})
        }

        const returns = await ReturnRequest.find({userEmail:email}).sort({requestDate:-1});
        return NextResponse.json(returns)
    }catch(err){
        // console.error('Get user returns error:',err);
        return NextResponse.json({error:'Failed to fetch returns'},{status:500});
    }
}