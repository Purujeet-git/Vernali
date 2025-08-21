'use client'
import React from 'react';
import Link from 'next/link';

import { useSession, signIn, signOut } from "next-auth/react"


const page = () => {
  const { data: session } = useSession()
  return (
    <>
    {session ? (
        <>
          <p className='text-black'>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) :(
    <div className='h-[100vh] text-black flex'>
      <div className='h-full bg-amber-950 w-1/2'> 
        
      </div>
      <div className='flex flex-col items-start mx-52  justify-center'>
        <p className='text-3xl font-mono'>Create Your Account</p>
        <p className='text-xl'>Enter your details here </p>
        <div className='flex flex-col gap-5 w-full'>
        <div className='w-full border-b-2'><input placeholder='Name' className='p-4 text-black border-none focus:ring-0 focus:outline-0 rounded-sm text-clip'></input></div>
        <div className='w-full border-b-2'><input placeholder='Email or Phone Number' className='p-4 text-black border-none focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'></input></div>
        <div className='w-full border-b-2'><input placeholder='Password' className='p-4 text-black border-none focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'></input></div>
        <button className='bg-red-600 font-mono w-full text-white p-5 rounded-sm'>Create Account</button>
        <button onClick={()=> signIn("google")}  className='font-mono w-full text-black bg-white border p-5 rounded-sm'>Sign Up with Google</button>
        <div className='flex gap-10'><p>Already have an account?</p><p className='underline decoration-dotted'><Link href={"/Login"}>Log in</Link></p></div>
        </div>
      </div>
    </div>)};
    </>
  )
}

export default page
