'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { fetchUser } from '../actions/useractions';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useModal } from '../ModalContext';

const dash = () => {

    const router = useRouter()

    const images = [
        "/image/cc1.jpg",
        "/image/cc2.jpg",
        "/image/cc3.jpg",
        "/image/cc4.jpg",
        "/image/cc5.jpg",
    ];

    const { data: session } = useSession()
    const searchParams = useSearchParams();
    const loginSource = searchParams.get('login');

    const [current, setCurrent] = useState(0);
    const [ userstopay, setUserstopay ] = useState([]);

    useEffect(() => {
        setInterval(() => {
            nextSlide()
        }, 4000);
    }, [])

    useEffect(() => {
        if (loginSource === 'login') {
            toast("Login Succesful!", {
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
            
                toast("OAuth LogIn Succesful!", {
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



    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % 5);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + length) % 5);
    };


    const fetchUsername = async (e) => {
        const res = await fetchUser(e.target.value, session?.user.email)
        setUserstopay(res)
    }

    const PageRedirect = (item) => {
        router.push(`/${item.displayname}`)
    }

    function defaultimages(str) {
        const prefix = "C:\\Users\\Vansh\\Desktop\\Projects\\getmeachai\\public\\"
        if(str.includes(prefix)){
        const str1 = str.slice(prefix.length)
        console.log(str1)
        return str1}
        else{
            return str
        }
    }


    return (
        <>

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
         
        <div className='relative inset-0 h-[103vh]'>

            <div className='absolute top-20 w-120'>
                <div className='flex w-full m-20 mb-0'>
                    <input type="search" className='bg-white p-2 text-black w-full rounded-md focus:z-10' placeholder='Search for your favorite creater' onChange={fetchUsername} />
                    <img src="gifs/search.gif" className='h-8 relative right-10' alt="" />
                </div>

                {userstopay && <div className='mx-20 w-112'>
                    {
                        userstopay.map((item) => {
                            return <div key={item._id} className='bg-black/30 px-4 py-2'>
                                <button onClick={() => PageRedirect(item)} className='text-white flex items-center p-2 gap-3 hover:bg-white/10 w-full rounded-lg'>
                                    <img className={`h-8 w-8 rounded-full ${item.picture ? "": "invert"}`} src={item.picture ? defaultimages(item.picture) : "gifs/avatar.gif"} alt="" />
                                    <span className=''>{item.displayname}</span>
                                </button>
                            </div>
                        })
                    }
                </div>}

            </div>


            <div className='flex flex-row h-[635px] w-[555px] overflow-hidden pb-5 z-0 absolute right-0 top-20' >
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
    )
}

export default dash
