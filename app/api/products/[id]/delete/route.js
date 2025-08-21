import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function DELETE(req, {params}){
    await connectDB();
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error:'Unauthorised'},{status:401});
    }

    const userIsAdmin = await isAdmin(session.user.email);
    if(!userIsAdmin){
        return NextResponse.json({error:'Forbidden'},{status:403});
    }

    const {id} = params;

    try{
        await Product.findByIdAndDelete(id);
        return NextResponse.json({success:true});
    }catch(err){
        return NextResponse.json({error:"Delete failed"},{status:500});
    }
}