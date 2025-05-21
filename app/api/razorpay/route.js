import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/Models/Payment";
import connectDB from "@/lib/mongodb";
import { fetchDisplayname } from "@/app/actions/useractions";
import { getServerSession } from "next-auth";
import { authoptions } from "@/lib/auth";

let razorpaySecret;
const getData = async ()=>{
      const session = await getServerSession(authoptions);
      if(session){
      const fetched = await fetchDisplayname(session?.user.email)
      razorpaySecret = fetched.razorpaySecret
      return razorpaySecret}
}

export const POST = async (req)=>{
    await connectDB()
    let body = await req.formData()
    body = Object.fromEntries(body)

    // check if razorOrderpay id is present on server
    let p = await Payment.findOne({order_id: body.razorpay_order_id})
    if(!p){
        return NextResponse.json({success:false, message:"Order Id not found"})
    }
    
    const razorpaySecret = await getData()
    console.log("to check error",razorpaySecret)

    let x = validatePaymentVerification({"order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id}, body.razorpay_signature, razorpaySecret)

    if(x){
        const updatedPayment = await Payment.findOneAndUpdate({order_id: body.razorpay_order_id}, {done: "true"}, {new: true})
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentDone=true`)
    }
    else{
        return NextResponse.json({success:false, message:"Payment verification failed"})
    }
}

             

