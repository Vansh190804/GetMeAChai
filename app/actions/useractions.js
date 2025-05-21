"use server"
import Razorpay from "razorpay"
import Payment from "@/Models/Payment"
import connectDB from "@/lib/mongodb"
import User from "@/Models/User"
import path from 'path';
import fs from 'fs';
import { disconnect } from "process"



export const initiate = async (amount, to_username, paymentForm, razorpayId, razorpaySecret) => {
    await connectDB()
    var instance = new Razorpay({ key_id: razorpayId, key_secret: razorpaySecret })

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    // create a payment object which shows a pending payment
    
    await Payment.create({order_id:x.id, amount: amount, to_user: to_username, name: paymentForm.name, message: paymentForm.message, createdAt: x.created_at
    })

    return x
}

export const fetchUser = async (username, email)=>{
       await connectDB()
       const regex = new RegExp(username, 'i')
       let u = await User.find({displayname: { $regex: regex }, email: {$ne: email}})
       if(u && username){
       let user = u.map(item=> item.toObject({flattenObjectIds: true}))
       return user}
}

export const fetchDisplayname = async (email)=>{
    await connectDB()
    let u = await User.findOne({email: email})
    if(u){
        let user = u.toObject({flattenObjectIds: true})
        return user
    }
}

export const fetchmainpage = async (displayname)=>{
    await connectDB()
    let u = await User.findOne({displayname: displayname})
    if(u){
        let user = u.toObject({flattenObjectIds: true})
        return user
    }
}

export const fetchPayments = async (username)=>{
    await connectDB()
    let payments = await Payment.find({to_user: username}).sort({amount: -1})
    let pay = payments.map(item=> item.toObject({flattenObjectIds: true}))
    return pay
}

export const updateUser = async (data, email)=>{
    await connectDB()
    
    const picture = data.get('picture')
    const coverpic = data.get('coverpic')
    const razorpayId = data.get('razorpayId')
    const razorpaySecret = data.get('razorpaySecret')
    const displayname = data.get('displayname')
    const tagline = data.get('tagline')
    const Array = []
    
    if(picture){
    const uploadDir = path.join(process.cwd(), 'public/uploads/profile')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const buffer = await picture.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)
    
    const fileName = `${Date.now()}_${picture.name}`
    const filePath = path.join(uploadDir, fileName)
    
    fs.writeFileSync(filePath, imageBuffer)
    Array[0]= filePath
    }

    if(coverpic){
    const uploadDir = path.join(process.cwd(), 'public/uploads/cover')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    
    const buffer = await coverpic.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)

    const fileName = `${Date.now()}_${coverpic.name}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, imageBuffer)
    Array[1]=filePath
    }
    
    var count = 0;
    const existingprofiles = await User.find({isProfile: true})
    existingprofiles.length>0 && existingprofiles.map((item)=>{
        if(item.displayname === displayname){
                   count +=1
        }
    })
   
    if(count ==0){
    const existing = await User.findOneAndUpdate({email: email}, { $set: { displayname:displayname, tagline: tagline? tagline: "", razorpayId: razorpayId, razorpaySecret: razorpaySecret, picture: picture? Array[0]: "", coverpic: coverpic? Array[1]: "", isProfile: true }}, {new: true})
     
    return(existing.toObject({flattenObjectIds: true})) 
    }
    else{
        throw new Error("Display Name exists")
    }
}

export const edituser = async (data, images, email)=>{
    await connectDB()
    const displayname = data.displayname.trim()
    const tagline = data.tagline
    const razorpayId = data.razorpayId
    const razorpaySecret = data.razorpaySecret
    const coverpic = images.coverpic
    const picture = images.picture
   
    const user = await User.findOneAndUpdate({email: email}, {$set: {displayname: displayname, tagline: tagline, razorpayId: razorpayId, razorpaySecret: razorpaySecret, picture: picture? picture: "", coverpic: coverpic? coverpic: ""}}, {new: true})

    return user.toObject({flattenObjectIds: true})

}

export const uploadimage = async (images, filetype)=>{
 
    
    if(images.picture && filetype==="picture" || filetype==="picture_"){
    const picture = images.picture       
    const uploadDir = path.join(process.cwd(), 'public/uploads/profile')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const buffer = await picture.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)
    
    const fileName = `${Date.now()}_${picture.name}`
    const filePath = path.join(uploadDir, fileName)
    
    fs.writeFileSync(filePath, imageBuffer)
    return filePath
    }

    if(images.coverpic && filetype === "coverpic" || filetype==="coverpic_"){ 
    const coverpic = images.coverpic       
    const uploadDir = path.join(process.cwd(), 'public/uploads/cover')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const buffer = await coverpic.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)
    
    const fileName = `${Date.now()}_${coverpic.name}`
    const filePath = path.join(uploadDir, fileName)
    
    fs.writeFileSync(filePath, imageBuffer)
    return filePath
    }
   
}