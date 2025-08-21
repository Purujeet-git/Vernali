import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if(!session || session.user.role !== 'admin'){
        return NextResponse.json({error:'Unauthorized'},{status:401});
    }

    await connectDB();

    const {searchParams} = new URL(req.url);
    const status  = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const query = {
        orderStatus: status,
        $or:[
            {customerName:{$regex:search,$options:"i"}},
            {customerEmail:{$regex:search,$options:"i"}},
            {_id:search},
            {trackingNumber:{$regex:search,$options:"i"}},
        ],
    };
    try{
        const orders = await Order.find(query).sort({createdAt:-1});
        return NextResponse.json({orders});
    }
    catch(err){
        return NextResponse.json({error:"failed to fetch orders"},{status:500});
    }
}