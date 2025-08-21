import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export async function GET(req){
    try{
        await connectDB();

        const session = await getServerSession();
        if(!session || !session.user.email){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }

        const userEmail = session.user.email;

        const orders = await Order.find({
            userEmail,
            orderStatus: "Shipped",
        }).sort({createdAt:-1});

        return NextResponse.json(orders);
    }catch(error){
        // console.error(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}