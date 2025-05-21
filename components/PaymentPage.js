"use client"
import React, { useEffect } from 'react'
import { fetchDisplayname, fetchmainpage, initiate } from '@/app/actions/useractions';
import { useState } from 'react';
import { fetchPayments } from '@/app/actions/useractions';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


const PaymentPage = ({ username }) => {


    const [paymentForm, setpaymentForm] = useState({})
    const [errors, setErrors] = useState({
        name: "",
        payment: ""
    })
    const { data: session, status } = useSession()
    const [details, setDetails] = useState()
    const [loading, setLoading] = useState(true)

    const [allPayments, setAllPayments] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const searchParams = useSearchParams()
    const paySuccess = searchParams.get("paymentDone")
    const router = useRouter()

    function totalamount() {
        let totalamount = 0;
        allPayments.map((item)=>{
             if(item.done){
             totalamount += parseInt(item.amount/100)
             }
        })
        return totalamount
    }

    function numberofpayments() {
            let numberofpayments = 0;
            allPayments.map((item)=>{
             if(item.done){
             numberofpayments += 1
             }
            })
            return numberofpayments
    }

    function done(){
            let out = false
        if(allPayments.length>0){
            allPayments.map((item)=>{
             if(item.done){
                out = true
             }
            })
        }
            return out
    }

    function defaultimages(str) {
        const prefix = `C:\\Users\\Vansh\\Desktop\\Projects\\getmeachai\\public`
        if(str.includes(prefix)){
        const str1 = str.slice(prefix.length)
        return str1}
        else{
            return str
        }
    }

    useEffect(() => {
        paySuccess && toast.success("Payment Succesfull!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        })
        const params = new URLSearchParams(window.location.search)
        params.delete('paymentDone')
        const newUrl =
            params.toString().length > 0
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname

        router.replace(newUrl, { scroll: false })
    }, [])

    useEffect(() => {
        if (session && status === "authenticated") {
            getData()
        }
    }, [session, status])


    useEffect(() => {
        setTimeout(() => {
            setErrors({ ...errors, name: "", payment: "" })
        }, 3000);
    }, [errors])

    useEffect(() => {
        console.log(details)
    }, [details])


    const handleChange = (e) => {
        setpaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
    }

    function capitalizeFirstLetter(str) {
        if (!str) return "";
        let str1 = str.toLowerCase()
        return str1.charAt(0).toUpperCase() + str1.slice(1);
    }


    const pay = async (amount, e) => {
        if (e ? paymentForm.name && paymentForm.amount : paymentForm.name) {
            let a = await initiate(amount, username, paymentForm, currentUser.razorpayId, currentUser.razorpaySecret)
            let orderId = a.id
            var options = {
                "key": currentUser.razorpayId,
                "amount": amount,
                "currency": "INR",
                "name": "Get me a chai",
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": orderId,
                "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                "prefill": {
                    "name": username,
                    "email": details.email,
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                },
                "method": ["upi", "card", "netbanking"]
            }
            var rzp1 = new Razorpay(options);
            rzp1.open();
        }

        else {
            !paymentForm.name ? e && !paymentForm.amount ? setErrors({ ...errors, name: "Name is required", payment: "Amount is required" }) : setErrors({ ...errors, name: "Name is required", payment: "" }) : !paymentForm.amount ? setErrors({ ...errors, name: "", payment: "Amount is required" }) : setErrors({ ...errors, name: "", payment: "" })
        }
    }

    const getData = async () => {
        const paymentDetails = await fetchPayments(username)
        setAllPayments(paymentDetails)
        const currentUser = await fetchDisplayname(session?.user.email)
        setCurrentUser(currentUser)
        try {
            const fetched = await fetchmainpage(username);
            setDetails(fetched);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />


            <div className='text-white'>
                <img className='object-cover h-100 w-screen mt-19' src={!loading && details.coverpic? defaultimages(details.coverpic): "/image/defaultcover.png"} alt="" />
                <div className='w-full relative bottom-15 flex flex-col items-center justify-center'>
                    <img className='object-cover h-30 w-30 rounded-xl border border-gray-500' src={!loading && details.picture? defaultimages(details.picture): "/image/defaultpicture.png"} alt="" />
                    <h1 className='text-3xl pt-4 pb-1'>{!loading && details.displayname}</h1>
                    <span className='text-sm'>{!loading && details.tagline? details.tagline: ""}</span>
                    <div className={`flex gap-4 text-sm h-10 items-center text-gray-500 ${allPayments.length>0? "": "w-98vw relative left-2.5 justify-center"}`}>
                        <span>{allPayments.length>0? `${numberofpayments()} payments made`: "No payments made"} </span>
                        {allPayments.length>0? <span> &bull; </span>: ""}
                        <span>{allPayments.length>0? `₹${totalamount()} amount raised`: ""} </span>
                    </div>
                    <button className='rounded-lg bg-white px-2 h-10 text-black m-2 font-bold text-sm'>{!loading &&  details.email != session?.user.email? `Let's get ${username} a chai!`: "Create to Earn"}</button>
                </div>
            </div>

            <div className={`text-white px-10 flex w-full h-120 gap-10 pb-30 ${!loading && details.email != session?.user.email? "": "justify-center"}`}>
                <div className='bg-black/50 w-1/2 rounded-xl flex flex-col items-center p-10'>
                    <h1 className='text-2xl font-bold p-2'>Supporters</h1>
                    {
                        <div className='w-full flex flex-col gap-1'>
                            {
                                done()? allPayments.map((item) => {
                                    return item.done && <div key={item._id} className='flex gap-2 items-center min-h-6'>

                                        <span className='font-bold text-amber-300'>{capitalizeFirstLetter(item.name)}</span>
                                        <span className='text-sm'> Donated </span>
                                        <span className='font-bold text-green-300'> {`₹${item.amount / 100}`}</span>
                                        {item.message && <div className='flex gap-1 items-center'>
                                            <span className='text-sm h-6 w-25'>with a message </span>
                                            <span className='font-bold text-blue-500 h-6 w-100'>"{item.message}"</span>
                                        </div>
                                        }
                                    </div>
                                }) :
                                    <div className='flex flex-col text-md items-center p-20 text-amber-300'>
                                        <span>No supporters yet.</span>
                                        Create more to get funded by your fans.
                                    </div>
                            }
                        </div>
                    }
                </div>

                {!loading &&  details.email != session?.user.email? 
                <div className='bg-black/50 w-1/2 rounded-xl flex flex-col p-10 gap-3'>
                    <h1 className="font-bold text-2xl pb-2">Make a payment</h1>
                    <input onChange={handleChange} value={paymentForm.name || ""} name="name" type="text" className={`border rounded-lg bg-black text-white p-2 text-sm ${errors.name ? "placeholder:text-red-500 placeholder:font-bold" : ""}`} placeholder={`${errors.name ? errors.name : "Enter name"}`} />

                    <input onChange={handleChange} value={paymentForm.message || ""} name="message" type="text" className={`border rounded-lg bg-black text-white p-2 text-sm`} placeholder="Enter message" />

                    <input onChange={handleChange} value={paymentForm.amount || ""} name="amount" type="number" min="1" className={`border rounded-lg bg-black text-white p-2 text-sm appearance-none custom-number-input  ${errors.payment ? "placeholder:text-red-500 placeholder:font-bold" : ""}`} placeholder={`${errors.payment ? errors.payment : "Enter amount"}`} />

                    <button type="button" className="text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer w-full" onClick={(e) => pay(paymentForm.amount * 100, e)} >Pay</button>
                    <div className='flex flex-row gap-5'>
                        <button className='bg-slate-800 h-10 p-5 rounded-lg flex items-center font-bold text-sm cursor-pointer' onClick={() => pay(1000)}>Pay ₹10</button>
                        <button className='bg-slate-800 h-10 p-5 rounded-lg flex items-center font-bold text-sm cursor-pointer' onClick={() => pay(2000)}>Pay ₹20</button>
                        <button className='bg-slate-800 h-10 p-5 rounded-lg flex items-center font-bold text-sm cursor-pointer' onClick={() => pay(3000)}>Pay ₹30</button>
                    </div>
                </div>: 
                ""
                }
            </div>

            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </>
    )
}

export default PaymentPage
