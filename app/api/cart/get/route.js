import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req){
    await connectDB();

    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});

    
    const userEmail = session?.user?.email;

    if(!userEmail){
        return NextResponse.json({message:"Unauthorized"},{status:401});
    }
    

    try{
        const items = await Cart.find({userEmail});
        // console.log("Found cart items:", items);
    return NextResponse.json({cart:items});
}
    catch(error){
        // console.error("Error fetching cart:", error);
        return NextResponse.json({error:"Failed to fetch cart"},{status:500});
    }
}

