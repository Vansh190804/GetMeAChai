"use client"
import React, { useEffect, useState } from 'react'
import { useModal } from '../app/ModalContext';
import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { fetchDisplayname } from '@/app/actions/useractions';

const NavBar = () => {

  const { setShowLogin, setShowSignup, noprofile, setNoprofile} = useModal();
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname();
  const isMainpage = pathname === '/'
  const [dropdown, setDropDown] = useState(false)
  const [mypage, setMyPage] = useState()
  const [ test, setTest ] = useState({})


  const homeRoute = () => {
    setShowLogin(false)
    setShowSignup(false)
    router.push("/")
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      }
      else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (session && status === "authenticated") {
      getURL(session.user.email)
    }
  }, [session, status])


  const fetchName = async () => {
    const user = await fetchDisplayname(session?.user.email)
    if (user && user.isProfile) {
      router.push(`/${user.displayname}`)
    }
    else {
         setNoprofile(1) 
         router.push('/dashboard')
    }
  }

  const toedit = async ()=>{
    const user = await fetchDisplayname(session?.user.email)
    if (user && user.isProfile) {
      router.push(`/customize`)
    }
    else {
         setNoprofile(1)
         router.push('/dashboard')
    }
  }
 
  const getURL = async (email) => {
    if(!email){ return null }
    else {
    const user = await fetchDisplayname(email)
       user.isProfile &&
       setMyPage(user.displayname)
    }
  }

  const urlformypage = (str) => {
    const str1 = str.replace(/%20/g, " ").replace("/", "")
    return str1
  }

  if (session && !isMainpage) {
    return (
      <div>
        
        <nav className={`flex  py-4 fixed text-white bg-black justify-between px-10 w-full top-0 z-10`}>
          <div className='flex justify-center items-center'>
            <span className='font-black font-sans text-2xl cursor-pointer' onClick={homeRoute}>Get Me A Chai</span>
          </div>
          <div>

            <button onClick={() => dropdown ? setDropDown(false) : setDropDown(true)} onBlur={() => setTimeout(() => setDropDown(false), 300)} id="dropdownInformationButton" data-dropdown-toggle="dropdownInformation" className={`text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 cursor-pointer flex items-center gap-4 rounded-b-xs`} type="button">
              More
              <img src="/gifs/more.gif" className='h-5' alt="" />
            </button>

            <div id="dropdownInformation" className={`z-10 ${dropdown ? "" : "hidden"} absolute bg-gray-800 divide-y divide-gray-600 rounded-lg shadow-sm right-10`}>
              <div className="text-md flex gap-4 py-5 px-3 items-center">
                <img className={`h-10 rounded-full ${session.user.image ? "" : "invert"}`} src={session.user.image ? session.user.image : "/gifs/avatar.gif"} alt="" />
                <div className='flex flex-col'>
                  <div>{session.user.name}</div>
                  <div className="font-medium truncate">{session.user.email}</div>
                </div>
              </div>
              <ul className="text-sm w-full py-2 flex flex-col" aria-labelledby="dropdownInformationButton">

                {urlformypage(pathname) != mypage ?
                  urlformypage(pathname) != "dash" && urlformypage(pathname) != "dashboard" ?
                    <>
                      <li onClick={fetchName} className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                        <img src="/gifs/page.gif" className="h-8 invert" alt="" />
                        Your Page
                      </li>

                      <Link href="/dash">
                        <li className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                          <img src="/gifs/page.gif" className="h-8 invert" alt="" />
                          Dashboard
                        </li>
                      </Link> 
                    </> :
                    <li onClick={fetchName} className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                      <img src="/gifs/page.gif" className="h-8 invert" alt="" />
                      Your Page
                    </li> :

                  <Link href="/dash">
                    <li className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                      <img src="/gifs/page.gif" className="h-8 invert" alt="" />
                      Dashboard
                    </li>
                  </Link>
                }

                {pathname!='/customize' && <li onClick={toedit} className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                  <img src="/gifs/settings.gif" className="h-8 invert" alt="" />
                  Customize Profile
                </li>}
              </ul>
              <div className="py-2" onClick={() => signOut({ callbackUrl: "/" })}>
                <div className='p-2 flex gap-2 hover:bg-gray-600'>
                  <img src="/gifs/out.gif" className='h-8 invert' alt="" />
                  <button className="cursor-pointer w-full text-sm text-start font-bold">Sign out</button>
                </div>
              </div>
            </div>

          </div>
        </nav>
      </div>
    )
  }

  else if (session && isMainpage) {
    return (
      <div>

        <nav className={`flex py-8 fixed text-white justify-between px-10 w-full top-0 ${scrolled ? "bg-white/50" : ""}`}>
          <div className={`flex justify-center items-center ${scrolled ? "text-black" : ""}`}>
            <span className='font-black font-sans text-2xl cursor-pointer' onClick={homeRoute}>Get Me A Chai</span>
          </div>
          <button onClick={() => dropdown ? setDropDown(false) : setDropDown(true)} onBlur={() => setTimeout(() => setDropDown(false), 300)} id="dropdownInformationButton" data-dropdown-toggle="dropdownInformation" className={`text-black bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 cursor-pointer flex items-center gap-4 rounded-b-xs`} type="button">
            More
            <img src="/gifs/more.gif" className='h-5' alt="" />
          </button>

          <div id="dropdownInformation" className={`z-10 ${dropdown ? "" : "hidden"} absolute right-10 top-20 bg-gray-800 divide-y divide-gray-600 rounded-lg shadow-sm`}>
            <div className="text-md flex gap-4 py-5 px-3 items-center">
              <img className={`h-10 rounded-full ${session.user.image ? "" : "invert"}`} src={session.user.image ? session.user.image : "/gifs/avatar.gif"} alt="" />
              <div className='flex flex-col'>
                <div>{session.user.name}</div>
                <div className="font-medium truncate">{session.user.email}</div>
              </div>
            </div>
            <ul className="text-sm w-full py-2 flex flex-col" aria-labelledby="dropdownInformationButton">

              <li onClick={fetchName} className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                <img src="/gifs/page.gif" className="h-8 invert" alt="" />
                Your Page
              </li>
              
              
              <li onClick={toedit} className='flex gap-2 hover:bg-gray-600 p-2 cursor-pointer w-full text-start font-bold items-center'>
                <img src="/gifs/settings.gif" className="h-8 invert" alt="" />
                Customize Profile
              </li>
              
            </ul>
            <div className="py-2" onClick={() => signOut({ callbackUrl: "/" })}>
              <div className='p-2 flex gap-2 hover:bg-gray-600'>
                <img src="/gifs/out.gif" className='h-8 invert' alt="" />
                <button className="cursor-pointer w-full text-sm text-start font-bold">Sign out</button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  else {
    return (
      <div>
        <nav className={`flex py-8 fixed text-white justify-between px-10 w-full top-0 ${scrolled ? "bg-white/50" : ""}`}>
          <div className={`flex justify-center items-center ${scrolled ? "text-black" : ""}`}>
            <span className='font-black font-sans text-2xl cursor-pointer'>Get Me A Chai</span>
          </div>
          <div className='flex justify-end'>
            <div className={`flex gap-5 ${scrolled ? "text-black" : ""}`}>
              <button className='rounded-full py-2 px-4 cursor-pointer bg-white text-black hover:bg-black hover:text-white font-bold' onClick={() => setShowSignup(true)}>
                <span className={`transition-transform duration-500 hover:rotate-x-360 inline-block`}>Sign Up</span>
              </button>
              <button className='rounded-full py-2 px-4 cursor-pointer hover:bg-white hover:text-black font-bold' onClick={() => setShowLogin(true)}>
                <span className='transition-transform duration-500 hover:rotate-x-360 inline-block'>Log In</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    )
  }

}

export default NavBar
