import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { NextResponse } from "next/server";

export async function PUT(req,{params}) {
    await connectDB();
    const {id} = params;
    const {status,resolutionType,rejectionNote} = await req.json();

    const updateFields = {
        status,
        processedDate: new Date(),
    };

    if(status === 'approved'){
        updateFields.rejectionNote = rejectionNote;
    }

    await ReturnRequest.findByIdAndUpdate(id,updateFields);

    return NextResponse.json({success:true});
}

export async function GET() {
    await connectDB();
    const requests = await ReturnRequest.find().sort({requestDate:-1});
    return NextResponse.json(requests);
}