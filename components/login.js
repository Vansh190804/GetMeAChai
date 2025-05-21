"use client"
import React from 'react'
import { useForm } from "react-hook-form";
import { useModal } from '../app/ModalContext';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm()
  
  const router = useRouter()
  const { setShowLogin, setShowSignup } = useModal()
  const [Incorrect, setIncorrect] = useState("")

  const delay = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIncorrect("");
        resolve();
      }, 1500);
    });
  }

  useEffect(() => {
    if (errors) {
      setTimeout(() => {
        clearErrors()
      }, 2000);
    }
  }, [errors])

  const onSubmit = async (data) => {
    const res = await fetch("/api/login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    const a = await res.json()
    console.log(a.user)

    if (!a.user) {
      if (a.provider) {
        if (a.provider === 'credentials') {
          setIncorrect(a.message)
          delay()
        }
        else {
          setIncorrect(`Email is linked with an OAuth ${a.provider} account`)
          await delay()
          setShowLogin(false)
          setShowSignup(true)
        }
      }
      else {
        toast(a.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        await delay()
        setShowLogin(false)
        setShowSignup(true)
      }
    }
    else {
      const res = await signIn("credentials", {
        email: a.user.email,
        password: a.user.password,
        redirect: false,
      });
      if (res?.ok) {
        if(!a.user.isProfile){
        router.push("/dashboard?login=login")}
        else{
          router.push('/dash?login=login')
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

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

      {/* Dimmed background */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className='bg-white border-2 w-80 h-80 relative z-10  flex flex-col items-center p-5'>

        <h1 className='text-xl font-bold'>LOGIN</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center p-5 gap-2'>

          <input {...register("identifier", { required: { value: true, message: "Username or Email is required" } })} type="text" className='border w-60 rounded-full p-2' placeholder='Username/Email' />
          {errors.identifier && <div className='text-red-500 text-sm'>{errors.identifier.message}</div>}

          <input {...register("password", { required: { value: true, message: "Password is required" } })} type="password" className='border w-60 rounded-full p-2' placeholder='Password' />
          {errors.password && <div className='text-red-500 text-sm'>{errors.password.message}</div>}
          {Incorrect && <div className='text-red-500 text-center'>{Incorrect}</div>}

          <input type="submit" disabled={isSubmitting} className='cursor-pointer bg-blue-500 w-20 h-8 rounded-full font-bold mt-5 border hover:bg-black hover:text-white' value="Log In" />
          <span className='cursor-pointer text-sm hover:text-gray-500' onClick={() => setShowLogin(false) & setShowSignup(true)}>Dont have an account?Sign up</span>

        </form>
      </div>
    </div>
  )
}

export default Login
