import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req){
    try{
        await connectDB();
        const {name,email,password} = await req.json();

        if(!email || !password){
            return NextResponse.json({error:"Email and password required"},{status:400});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error:"User already exists."},{status:400});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({message:"User created successfully"},{status:201});
    }catch(err){
        return NextResponse.json({error:err.message},{status:500});
    }
}