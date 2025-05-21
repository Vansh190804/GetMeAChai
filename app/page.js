"use client"
import React, { useEffect, useState } from "react";
import Login from "@/components/login";
import Signup from "@/components/signin";
import { useModal } from '../app/ModalContext';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { fetchDisplayname } from "./actions/useractions";



export default function Home() {

  
  const { showLogin, setShowLogin } = useModal(false)
  const { showSignup, setShowSignup, firstProfile, setFirstProfile} = useModal(false)
  const { count, setCount }= useModal()
  const [ profilecheck, setProfileCheck ]= useState()
  const { data: session, status } = useSession()
  

  useEffect(() => {
    if(count){
      setShowSignup(true)
      setTimeout(() => {
        setCount("")
      }, 5000);
    }
    else if(firstProfile==1){
      setShowSignup(true)
      setTimeout(() => {
        setFirstProfile(0)
      }, 5000);
    }
  }, [])

  useEffect(()=>{
     if(session && status == "authenticated"){
      fetchProfile()
     }
  },[session, status])
 
  const fetchProfile = async ()=>{
        const user = await fetchDisplayname(session?.user.email)
        setProfileCheck(user.isProfile)
  }
  

  return (
    <>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}

      <img src="https://c14.patreon.com/state_of_create_home_d0fe3ab2c7.jpg" className=" h-170 w-full object-cover" alt="" />
      <div className="flex  items-center flex-col text-white mb-20 mt-30 p-10 absolute top-0">
        <div className="font-bold text-7xl flex items-center">
          <img src="/gifs/teacup.gif" className="h-40 relative bottom-5" alt="" />
          <span className="text-blue-500">Buy Me A Chai</span>
        </div>
        <div className="flex justify-center flex-col items-center text-2xl">
          <p>A crowdfunding platform for creators.</p>
          <p>Get funded by your fans and followers. Start Now!</p>
        </div>
        <div className="z-10 p-20 flex gap-5">
          {!session? 
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer" onClick={() => setShowSignup(true)}>Get Started</button>:
          !profilecheck ? <Link href="/dashboard">
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">Dashboard</button>
          </Link>:
          <Link href="/dash">
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">Dashboard</button>
          </Link>
          }
        </div>
      </div>

      <div className="bg-slate-800 h-0.5 w-full"></div>

      <div className="text-white flex flex-col items-center">
        <span className="text-lg font-black m-10">
          Your Fans Can Buy You A Chai
        </span>
        <div className="flex flex-row w-full justify-around p-7 m-20">
          <div className="flex flex-col justify-center items-center">
            <span className="overflow-hidden w-20 h-20 inline-block rounded-full"><img className="object-cover w-full h-full" src="/gifs/work.gif" alt="" /></span>
            <span className="font-bold text-sm p-1">Fans want to help</span>
            <p className="text-sm">Your fans are available to help you</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="overflow-hidden w-40 h-40 inline-block rounded-full"><img className="object-cover w-full h-full" src="/gifs/fund.gif" alt="" /></span>
            <span className="font-bold text-sm p-1">Fans want to help</span>
            <p className="text-sm">Your fans are available to help you</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="overflow-hidden w-20 h-20 inline-block rounded-full"><img className="object-cover w-full h-full" src="/gifs/fans.gif" alt="" /></span>
            <span className="font-bold text-sm p-1">Fans want to help</span>
            <p className="text-sm">Your fans are available to help you</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 h-0.5 w-full mt-7"></div>

      <div className="text-white flex flex-col items-center justify-center py-5">
        <div className="flex flex-row py-10 w-full items-center justify-around m-10">
          <div className="w-150">
            <span className="text-lg font-black">What is Crowdfunding?</span>
            <h4>Crowdfunding is when a group of people each contribute a small amount of money. Usually online—to help fund a project, product, cause, or business.</h4>
            <h2 className="font-bold text-md pt-4">Common Types</h2>
            <span className="text-sm font-bold underline">1. Reward-Based</span>
            <p className="text-sm">People get a product, perk, or thank-you in return.
              E.g. Kickstarter — back a new gadget and get one when it launches.</p>
            <span className="text-sm font-bold underline">2. Donation-Based</span>
            <p className="text-sm">Purely charitable — no reward.
              E.g. GoFundMe for medical bills or emergencies.</p>
            <span className="text-sm font-bold underline">3. Equity-Based</span>
            <p className="text-sm">People invest and get a small share of the business.
              E.g. StartEngine — invest in startups.</p>
            <span className="text-sm font-bold underline">4. Debt-Based</span>
            <p className="text-sm">People loan money and get repaid with interest.
              E.g. LendingClub.</p>
          </div>
          <iframe width="450" height="300" src="https://www.youtube.com/embed/voF1plqqZJA?si=tW5ygCC9_jYbNBgJ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <div className="bg-slate-800 h-0.5 w-full mt-7"></div>

        <div className="flex flex-row items-center justify-around w-full py-10 m-10">
          <div className="flex flex-col w-150 py-10">
          <span className="text-lg font-black">What Does Our Platform Do?</span>
          <p>GetMeAChai is a crowdfunding platform that empowers creators, makers, and dreamers to bring their projects to life with the support of their community. Whether you're an artist, writer, developer, or educator, GetMeAChai lets you receive small contributions—like someone buying you a chai—to fund your work, build momentum, and grow your creative journey. Supporters can back your ideas, access exclusive content, and become part of your story, helping you turn passion into progress, one chai at a time.</p>
          </div>
          <iframe width="450" height="300" src="https://www.youtube.com/embed/XJHr-s7moYU?si=EjV7QU-ZnlI8jJPv" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
    </>
  );
}
