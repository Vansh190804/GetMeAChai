import { NextResponse } from "next/server";
import User  from "@/Models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(request){
    await connectDB()
    const {username, password, email} = await request.json()

    const userbyemail = await User.findOne({email:email})
    const userbyname = await User.findOne({username:username})

    if(userbyemail){
        return NextResponse.json({message: "Email already exist!", provider:userbyemail.provider}, {status: 409})
        
    }

    else if(userbyname){
        return NextResponse.json({message: "Username exist! Choose something creative."}, {status:409})
    }
    
    else{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newuser = new User({username, email, password:hashedPassword})
    await newuser.save()    
    return NextResponse.json({message: "User signed in!"}, {status: 200})
    }
}
