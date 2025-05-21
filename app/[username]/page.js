import React from 'react'
import PaymentPage from '@/components/PaymentPage'

const Username = async ({params}) => {
  const param = await params
  const username = param.username

  const url = ()=>{
    const str = username.replace(/%20/g, " ")
    return str
  }
  return (
    <>
    <PaymentPage username= {url(username)}/>
   </>
  )
}

export default Username
