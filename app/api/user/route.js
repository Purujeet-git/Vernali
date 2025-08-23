import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        await connectDB();
        const { firstName, lastName, gender, email, phone } = await req.json();

        let user = await User.findOne({email});

        if(user){
            user.firstName = firstName;
            user.lastName=lastName;
            user.gender=gender;
            user.phone = phone;
            await user.save();
        }else{
            user = await User.create({ firstName,lastName,gender,email,phone});
        }

        return NextResponse.json({success:true,user},{status:200});
    }catch(error){
        return NextResponse.json({success:false,message:error.message},{status:500});
    }
}