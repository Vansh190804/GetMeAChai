import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import connectDB from "@/lib/mongodb";
import User from "@/Models/User"

export async function POST(request) {
    await connectDB()
    const { identifier, password } = await request.json()

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const userbyemailorname = await User.findOne(
        isEmail ? { email: identifier } : { username: identifier }
    )

    if (!userbyemailorname) {
        return NextResponse.json({ message: "User does not exist!" }, { status: 404 })
    }
    
    const isMatch = await bcrypt.compare(password, userbyemailorname.password)
    if (!isMatch) {
        return NextResponse.json({ message: "Incorrect password!", provider:userbyemailorname.provider}, { status: 401 })
    }


    return NextResponse.json({ message: "Login successful!", user:userbyemailorname}, {status: 200})
}