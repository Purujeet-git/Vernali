'use client'
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';


const Page = () => {
  const { data: session } = useSession()

  const [form, setForm] = useState({email:"",password:""});
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials",{
      email:form.email,
      password:form.password,
      redirect:false,
    });

    if(!res.error){
      router.push('/');
    }else{
      alert("Invalid email or password");
    }
  };

  return (
    <>
    {session ? (
        <>
          <p className='text-black'>{`Welcome, `}{session.user?.name}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) :(
    <div className='h-[100vh] text-black flex'>
      <div className='h-full bg-amber-950 w-1/2'> 
        
      </div>
      <div className='flex flex-col items-start mx-52  justify-center gap-2 1'>
        <p className='text-3xl font-mono'>Login Existing User</p>
        <div className='flex flex-col gap-5 w-full'>
        <form onSubmit={handleLogin} className='flex flex-col gap-2'>
          <input
            type='email'
            placeholder='E-mail'
            onChange={(e) => setForm({...form,email:e.target.value})}
            className='p-4 text-black border-black border-2  focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'
          />
          <input 
            type='password'
            placeholder='Password'
            onChange={(e) => setForm({...form,password:e.target.value})}
            className='p-4 text-black border-black border-2 focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'
          />
          <button type="submit"
          className='bg-red-600 font-mono w-full text-white p-5 rounded-sm'>Login</button>
        </form>
        <button onClick={()=> signIn("google")}  className='font-mono w-full text-black bg-white border flex items-center p-5 rounded-sm'>
          <Image src={"/google.png"} alt='google logo' height={50} width={50}/>
          {`Sign Up/Login with Google`}</button>
        <div className='flex justify-between gap-10'>
          <p>{`New User??`}</p>
          <span 
          onClick={()=> router.push('/auth/signup')}
          className='hover:underline cursor-pointer text-blue-700'>Create account</span>
        </div>
        </div>
      </div>
    </div>)};
    </>
  )
}

export default Page
