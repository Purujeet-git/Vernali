import { NextResponse } from "next/server";
import cart from "@/models/cart";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Cart from "@/models/cart";


export async function POST(req){
    await connectDB();

    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});

    const body = await req.json();
    const {productId,name,price,image,quantity} = body;

    const existingItem = await Cart.findOne({userEmail:session.user.email, productId});

    if(existingItem){
        existingItem.quantity += quantity;
        await existingItem.save();
        return NextResponse.json({message:"Cart Updated"});
    }

    await Cart.create({
        userEmail:session.user.email,
        productId,
        name,
        price,
        image,
        quantity,
    });

    return NextResponse.json({message:"Added to Cart"});
}
