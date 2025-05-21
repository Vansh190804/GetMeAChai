"use client"
import React from 'react'
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useModal } from '../ModalContext'
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { updateUser } from '../actions/useractions'



const dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams();
    const { setFirstProfile, noprofile, setNoprofile } = useModal()
    const [current, setCurrent] = useState(0);

    const images = [
        "/image/cc1.jpg",
        "/image/cc2.jpg",
        "/image/cc3.jpg",
        "/image/cc4.jpg",
        "/image/cc5.jpg",
    ];

    const loginSource = searchParams.get('login');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, watch },
        reset,
        clearErrors
    } = useForm({
        defaultValues: {
            displayname: "",
        }
    })

    useEffect(() => {
        if (loginSource === 'signin') {
            toast("User signed In!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            const params = new URLSearchParams(window.location.search)
            params.delete('login')
            const newUrl =
                params.toString().length > 0
                    ? `${window.location.pathname}?${params.toString()}`
                    : window.location.pathname

            router.replace(newUrl, { scroll: false })
        }
        else if (loginSource === 'oauth') {
            
                toast("OAuth SignIn Succesful!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
        
            const params = new URLSearchParams(window.location.search)
            params.delete('login')
            const newUrl =
                params.toString().length > 0
                    ? `${window.location.pathname}?${params.toString()}`
                    : window.location.pathname

            router.replace(newUrl, { scroll: false })
        }
    }, [loginSource])


    function capitalizeFirstLetter(str) {
        if (!str) return "";
        var str1 = str.toLowerCase()
        return str1 = str1.charAt(0).toUpperCase() + str1.slice(1);
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            setTimeout(() => {
                setFirstProfile(1)
                router.push("/")
            }, 50);
        }
        else if (status === "authenticated") {
            reset({ displayname: capitalizeFirstLetter(session.user.name) })
        }
    }, [session])

   
    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % 5);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + length) % 5);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        const file = data.picture?data.picture[0]:""
        const cover = data.coverpic?data.coverpic[0]:""
        formData.append('picture', file)
        formData.append('displayname', data.displayname)
        formData.append('razorpayId', data.razorpayId)
        formData.append('razorpaySecret', data.razorpaySecret)
        formData.append('coverpic', cover)
        formData.append('tagline', data.tagline? data.tagline: "")
 
        const res= await updateUser(formData, session?.user.email)

        router.push('/dash')
    } 

    useEffect(() => {
            setInterval(() => {
                nextSlide()
            }, 4000);

            if(noprofile ==1){
                 toast("Make a Profile first", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                setTimeout(() => {
                  setNoprofile(0)
                }, 1000);
            }
    }, [])

    useEffect(()=>{
          if(errors){
            setTimeout(() => {
                clearErrors()
            }, 2000);
          }
    }, [errors])



    if (session) {
        return <>
            {<ToastContainer
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
            />}

            <div className='flex justify-between h-[103vh] relative inset-0 z-0 w-full items-center bg-slate-950 bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]'>

                <div className="flex flex-col gap-4 text-white pl-40 pt-10">
                    <h1 className='font-bold text-3xl'>Set up your profile!</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-100 items-center' encType="multipart/form-data">

                        <div className='flex flex-col'>
                            <label htmlFor="displayname" className='font-bold text-purple-500'>Display Name</label>
                            <input {...register("displayname", { required: { value: true, message: "Display name is required" } })} type="text" className='border w-100 rounded-xl p-2' id="displayname" />
                            {errors.displayname && <div className='text-red-500 text-sm'>{errors.displayname.message}</div>}
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="tagline" className='font-bold text-purple-500'>Tag Line</label>
                            <input {...register("tagline", { required: { value: false } })} type="text" className='border w-100 rounded-xl p-2' id="tagline" />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="razorpayId" className='font-bold text-purple-500'>RazorPay ID</label>
                            <input {...register("razorpayId", { required: { value: true, message: "RazorPay ID is required" } })} type="text" className='border w-100 rounded-xl p-2' id="rozorpayId" />
                            {errors.razorpayId && <div className='text-red-500 text-sm'>{errors.razorpayId.message}</div>}
                        </div>

                        <div className='flex flex-col'> 
                            <label htmlFor="razorpaySecret" className='font-bold text-purple-500'>RazorPay Secret</label>
                            <input {...register("razorpaySecret", { required: { value: true, message: "RazorPay Secret is required" } })} type="text" className='border w-100 rounded-xl p-2' id="razorPaySecret" />
                            {errors.razorpaySecret && <div className='text-red-500 text-sm'>{errors.razorpaySecret.message}</div>}
                        </div>


                        <div className='flex flex-col' >
                            <label htmlFor="picture" className='font-bold text-purple-500'>Upload Profile Picture</label>
                            <input {...register("picture", { required: { value: false } })} type="file"
                                accept="image/*" className='border w-100 rounded-xl p-2 ' id="picture" />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="coverpic" className='font-bold text-purple-500'>Upload Cover Picture</label>
                            <input {...register("coverpic", { required: { value: false } })} type="file"
                                accept="image/*" className='border w-100 rounded-xl p-2' id="coverpic" />
                        </div>

                        <input type="submit" disabled={isSubmitting} className='cursor-pointer bg-purple-500 w-80 h-10 rounded-xl font-bold text-sm hover:bg-white hover:text-black' value="Save" />
                    </form>


                </div>

                <div className='flex flex-row h-[690px] w-[555px] overflow-hidden relative pb-5 z-10' >
                    {
                        images.map((image, index) => {
                            return <div key={index} className={`transition-opacity duration-500 ${index === current ? "opacity-100" : "opacity-0 absolute"}`}>
                                <img src={image} className='w-full' alt="" />
                            </div>
                        })
                    }
                    <button className='h-full absolute top-0 w-10 bg-transparent items-center justify-center font-bold hover:bg-white/20 flex' onClick={prevSlide}>
                        <span className='bg-black rounded-full w-8 h-8 text-white flex items-center justify-center'>&lt;</span>
                    </button>

                    <button className='bg-transparent h-full absolute top-0 right-0 w-10 flex items-center justify-center font-bold hover:bg-white/20' onClick={nextSlide}>
                        <span className='bg-black rounded-full w-8 h-8 text-white flex items-center justify-center'>&gt;</span>
                    </button>
                </div>

            </div>
        </>
    }

}

export default dashboard
