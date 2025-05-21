
'use client'
import React from 'react'
import { set, useForm } from 'react-hook-form'
import { edituser, fetchDisplayname, uploadimage } from '../actions/useractions'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'

const customize = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
        clearErrors
    } = useForm({
        defaultValues: {
            displayname: "",
            tagline: "",
            razorpayId: "",
            razorpaySecret: ""
        }
    })


    const router = useRouter()
    const { data: session, status } = useSession()
    const [userData, setUserData] = useState()
    const [toggle, setToggle]= useState(true)
    const [loading, setLoading] = useState(true)
    const [inputValues, setInputValues] = useState({ coverpic: "", picture: "", })
    const [update, setUpdate] = useState({ coverpic: "", picture: "" })
    const [count, setCount] = useState("")
    const [editit, setEditit] = useState({
        displayname: true,
        tagline: true,
        razorpayId: true,
        razorpaySecret: true
    })


    const onSubmit = async (data) => {
          const fetch = await edituser(data, update, session?.user.email)
          setTimeout(() => {
             router.push('/customize')
          }, 1000);
    }

    const fetchData = async () => {
        try {
            const fetched = await fetchDisplayname(session?.user.email)
            setUserData(fetched)
            setUpdate({coverpic: actualimage(fetched.coverpic), picture: actualimage(fetched.picture)})
        } finally {
            setLoading(false) 
        }
    }

    const actualimage = (str)=>{
        const prefix = "C:\\Users\\Vansh\\Desktop\\Projects\\getmeachai\\public\\"
        if(str.includes(prefix)){
        const str1 = str && str.slice(prefix.length)
        return str1}
        else{
            return str
        }
    }

    function defaultimages(str) {
        const prefix = "C:/Users/Vansh/Desktop/Projects/getmeachai/public/"
        const str1 = str && str.slice(prefix.length)
        const str2 = str1 && str1.slice(8)
        if (str2 && str2.startsWith('c')) {
            setUpdate({ ...update, coverpic: str1 })
            setInputValues({ ...inputValues, coverpic: "" })
        }
        else if (str2 && str2.startsWith('p')) {
            setUpdate({ ...update, picture: str1 })
            setInputValues({ ...inputValues, picture: "" })
        }
    }

    useEffect(() => {
        if (session && status === "authenticated") {
            fetchData()
        }
    }, [session, status])

    useEffect(() => {
        if (userData) {
            reset({ displayname: userData.displayname, tagline: userData.tagline, razorpayId: userData.razorpayId, razorpaySecret: userData.razorpaySecret })
        }
    }, [userData])

    const Change = (e) => {
        if (e.currentTarget.name === 'coverpic') {
            console.log(e.currentTarget.files)
            setInputValues({ coverpic: e.currentTarget.files[0], picture: "" })
            setCount(prev => prev === "coverpic" ? "coverpic_" : "coverpic")
        }
        else if (e.currentTarget.name === 'picture') {
            setInputValues({ picture: e.currentTarget.files[0], coverpic: "" })
            setCount(prev => prev === "picture" ? "picture_" : "picture")
        }
    }

    useEffect(() => {
        getimage(inputValues, count)
    }, [inputValues && count])


    const getimage = async (images, count) => {
        const fetched = await uploadimage(images, count)
        defaultimages(fetched)
    }

    const writefields = (e) => {
        setEditit({ ...editit, [e.currentTarget.name]: false })
    }

    const removeimage = (e)=>{
        if(update.coverpic || update.picture){
          if(e.currentTarget.name === 'coverpic'){
            setUpdate({...update, coverpic: ""})
            setToggle(false)
          }
          else if(e.currentTarget.name === 'picture'){
            setUpdate({...update, picture: ""})
            setToggle(false)
          }
        }
        else{
             toast("Upload Image", {
                                 position: "top-right",
                                 autoClose: 5000,
                                 hideProgressBar: false,
                                 closeOnClick: false,
                                 pauseOnHover: true,
                                 draggable: true,
                                 progress: undefined,
                                 theme: "dark",
                             })
        }
    } 

    useEffect(() => {
      console.log("update",update)
      console.log(userData)
    }, [update])

    return (
        <div className='m-20 mb-0'>
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

            <div className="flex flex-col gap-4 text-white">

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 items-center' encType="multipart/form-data">


                    <label htmlFor="coverpic" className='border w-[98vw] h-[23vw] relative inset-0 z-0 cursor-pointer' >
                        <img src={!update.coverpic ? 'image/defaultcover.png': update.coverpic} className='w-full h-[23vw] object-cover' alt="" />
                        <button type='button' name='coverpic' className='absolute top-1 left-1 cursor-pointer' onClick={(e)=>removeimage(e)}>
                             <img src="image/cross.png" className='h-8 hover:invert' alt="" />
                        </button>
                    </label>
                    <input {...register("coverpic", { required: { value: false } })} type="file"
                        accept="image/*" id="coverpic" className='hidden' onChange={(e) => Change(e)} />

                    <label htmlFor="picture" className='h-30 w-30 rounded-xl border border-gray-500 relative bottom-20 z-2 cursor-pointer'>
                        <img src={!update.picture ? !loading && toggle? userData.picture ? userData.picture : 'image/defaultpicture.png' : 'image/defaultpicture.png' : update.picture} className='rounded-xl h-29.5 w-30 object-cover' alt="" />
                        <button type='button' name='picture' className='absolute top-1 left-1 cursor-pointer' onClick={(e)=>removeimage(e)}>
                              <img src="image/cross.png" className='h-8 hover:invert' alt="" />
                        </button>
                    </label>
                    <input {...register("picture", { required: { value: false } })} type="file"
                        accept="image/*" id="picture" className='hidden' onChange={(e) => Change(e)} />


                    <div className='flex w-full justify-between px-50 relative bottom-20'>

                        <div className='flex flex-col'>
                            <label htmlFor="displayname" className='font-bold text-purple-500'>Display Name</label>
                            <div className='flex justify-between items-center w-100'>
                                <input {...register("displayname", { required: { value: true, message: "Display name is required" } })} type="text" className='border w-100 rounded-xl p-2' id="displayname" disabled={editit.displayname} />
                                <label htmlFor="displayname" className='font-bold text-purple-500'>
                                    <img src="image/pencil.png" name='displayname' className='invert h-8 w-8 relative right-10 cursor-pointer' alt="" onClick={(e) => writefields(e)} />
                                </label>
                            </div>
                            {errors.displayname && <div className='text-red-500 text-sm'>{errors.displayname.message}</div>}
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="tagline" className='font-bold text-purple-500'>Tag Line</label>
                            <div className='flex justify-between items-center w-100'>
                                <input {...register("tagline", { required: { value: false } })} type="text" className='border w-100 rounded-xl p-2' id="tagline" disabled={editit.tagline} />
                                <label htmlFor="tagline" className='font-bold text-purple-500'>
                                    <img src="image/pencil.png" name='tagline' className='invert h-8 w-8 relative right-10 cursor-pointer' alt="" onClick={(e) => writefields(e)} />
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className='flex w-full justify-between px-50 relative bottom-20'>

                        <div className='flex flex-col'>
                            <label htmlFor="razorpayId" className='font-bold text-purple-500'>RazorPay ID</label>
                            <div className='flex justify-between items-center w-100'>
                                <input {...register("razorpayId", { required: { value: true, message: "RazorpayId is required" } })} type="text" className='border w-100 rounded-xl p-2' id="razorpayId" disabled={editit.razorpayId} />
                                <label htmlFor="razorpayId" className='font-bold text-purple-500'>
                                    <img src="image/pencil.png" name='razorpayId' className='invert h-8 w-8 relative right-10 cursor-pointer' alt="" onClick={(e) => writefields(e)} />
                                </label>
                            </div>
                            {errors.razorpayId && <div className='text-red-500 text-sm'>{errors.razorpayId.message}</div>}
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="razorpaySecret" className='font-bold text-purple-500'>RazorPay Secret</label>
                            <div className='flex justify-between items-center w-100'>
                                <input {...register("razorpaySecret", { required: { value: true, message: "razorpaySecret is required" } })} type="text" className='border w-100 rounded-xl p-2' id="razorpaySecret" disabled={editit.razorpaySecret} />
                                <label htmlFor="razorpaySecret" className='font-bold text-purple-500'>
                                    <img src="image/pencil.png" name='razorpaySecret' className='invert h-8 w-8 relative right-10 cursor-pointer' alt="" onClick={(e) => writefields(e)} />
                                </label>
                            </div>
                            {errors.razorpaySecret && <div className='text-red-500 text-sm'>{errors.razorpaySecret.message}</div>}
                        </div>

                    </div>

                    <input type="submit" disabled={isSubmitting} className='cursor-pointer bg-purple-500 w-80 h-10 rounded-xl font-bold text-sm hover:bg-white hover:text-black relative bottom-20' value="Save" />
                </form>


            </div>
        </div>
    )
}

export default customize
