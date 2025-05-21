"use client"
import React from 'react'
import { useModal } from '@/app/ModalContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

const error = () => {

  const { count, setCount }= useModal()
  const router = useRouter()
  const searchParams = useSearchParams()

  const errorType = searchParams.get('error')
  
  useEffect(() => {
     setCount(errorType)
     router.push("/")
  }, [])
  

  return (
    <div>
    </div>
  )
}

export default error
