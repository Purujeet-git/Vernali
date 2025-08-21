import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { startOfDay,startOfWeek,startOfMonth } from "date-fns";

export async function GET(req) {
    await connectDB();

    const {searchParams} = new URL(req.url);
    const range = searchParams.get("range") || "day";

    let startDate = new Date();

    if(range === "week"){
        startDate = startOfWeek(new Date(),{weekStartsOn:1});
    }else if(range === "month"){
        startDate = startOfMonth(new Date());
    }else{
        startDate = startOfDay(new Date()); 
    }

    try{
        const topProducts = await Order.aggregate([
            // {$match:{createdAt:{$gte:startDate}}},
            {$unwind:"$items"},
            {
                $group:{
                    _id:"$items.productName",
                    unitsSold:{$sum:"$items.quantity"},
                    totalSales:{$sum:{$multiply:["$items.quantity","$items.price"]}},
                },
            },
            {$sort:{totalSales:-1}},
            {$limit:10}
        ]);

        return NextResponse.json({success:true,topProducts});
    }catch(error){
        return NextResponse.json({success:false,message:"Server Error"},{status:500});
    }
}