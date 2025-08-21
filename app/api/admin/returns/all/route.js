import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB();

    try{
        const returns = await ReturnRequest.find().sort({requestDate:-1});
        return NextResponse.json(returns);
    }catch(err){
        return NextResponse.json({error:'Failed to fetch returns'},{status:500});
    }
}