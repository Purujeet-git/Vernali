import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();

    const {searchParams} = new URL(req.url);
    const range = searchParams.get("range") || "day";

    let groupFormat;

    if(range === 'day') groupFormat = "%Y-%m-%d";
    else if(range === "month") groupFormat === "%Y-%m";
    else if(range === "week") groupFormat === "%Y-%U";

    try{
        const salesData = await Order.aggregate([
            {
                $group:{
                    _id:{$dateToString:{format:groupFormat,date:"$createdAt"}},
                    totalSales:{$sum:"$totalAmount"},
                    orderCount:{$sum:1},
                },
            },
            {$sort:{_id:1}},
        ]);
        return NextResponse.json({success:true,date:salesData});
    }catch(err){
        return NextResponse.json({success:false,message:"Error fetching sales data",error:err.message},{status:500});
    }
}