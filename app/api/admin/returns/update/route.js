import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { NextResponse } from "next/server";

export async function PUT(req) {
    await connectDB();

    try{
        const {returnId,status,rejectionNote} = await req.json();

        if(!returnId || !status){
            return NextResponse.json({error:'Missing RETURNID or status'},{status:400});
        }

        const validStatuses = ['approved','rejected','refunded']
        if(!validStatuses.includes(status)){
            return NextResponse.json({error:"Invalid status value"},{status:401});
        }

        const updateData = {
            status,
            processedDate: new Date(),
        }

        if(status === 'rejected' && rejectionNote){
            updateData.rejectionNote = rejectionNote
        }

        const updatedReturn = await ReturnRequest.findByIdAndUpdate(returnId,updateData,{
            new:true,
        })

        if(!updatedReturn){
            return NextResponse.json({error:'Return request not found'},{status:404});
        }

        return NextResponse.json({
            message:`Return ${status} successfully`,
            return:updatedReturn,
        })

    }catch(err){
        // console.error("Return update error:",err);
        return NextResponse.json({error:'Server Error'},{status:500});
    }
}