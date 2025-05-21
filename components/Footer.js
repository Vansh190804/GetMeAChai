"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

const Footer = () => {
  const { data: session } = useSession()
  
  return (
    <div className='w-full flex justify-center text-white text-sm absolute bottom-0 bg-black'>
        Copyright &copy; - All Right Reserved
    </div>
  )
}

export default Footer
