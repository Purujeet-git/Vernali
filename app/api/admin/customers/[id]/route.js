import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import ReturnRequest from "@/models/ReturnRequest";

export async function GET(req,{params}) {
    try{
        await connectDB();
        const customer = await User.findById(params.id).select(
            "firstName lastName email phone gender createdAt role adminNotes"
        );

        const orders = await Order.find({email:customer.email});
        const returns = await ReturnRequest.find({userEmail:customer.email});

        const totalSpent = orders.reduce((acc,order) => acc + order.totalAmount, 0);

        if(!customer){
            return NextResponse.json({success:false,error:"Customer not found"},{status:404});
        }

        return NextResponse.json({
            success:true,
            customer,
            orders,
            returns,
            totalSpent,
        })
    }catch(err){
        // console.error("Error fetching customer:",err);
        return NextResponse.json({success:false,error:"Server error"},{status:500});
    }
}

export async function PATCH(req,{params}) {
    await connectDB();
    const {id} = params;
    const body = await req.json();

    const updatedCustomer = await User.findByIdAndUpdate(
        id,
        {
            ...(body.adminNotes && {adminNotes:body.adminNotes}),
            ...(body.status && {status:body.status}),
        },
        {new:true}
    );



    return NextResponse.json({success:true,customer:updatedCustomer});
}

