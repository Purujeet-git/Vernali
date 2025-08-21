import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/cart";

export async function POST(req){

    await connectDB();
    
    const {productId,quantity,userEmail} = await req.json();


    try{
      const result = await Cart.updateOne(
        { _id: productId, userEmail},
        {$set:{quantity}},
      );

      return NextResponse.json({success:true},result);
    }catch(error){
      return NextResponse.json({success:false,error:error.message},{status:500});
    }
    
}