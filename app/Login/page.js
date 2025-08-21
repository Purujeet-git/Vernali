import React from 'react'

const page = () => {
  return (
    <div className='h-[100vh] text-black flex'>
      <div className='h-full bg-amber-950 w-1/2'> 
        
      </div>
      <div className='flex flex-col items-start mx-52  justify-center'>
        <p className='text-3xl font-mono mb-3'>Login to Exclusive</p>
        <p className='text-xl'>Enter your details here </p>
        <div className='flex flex-col gap-5 w-full'>
        <div className='w-full border-b-2'><input placeholder='Email or Phone Number' className='p-4 text-black border-none focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'></input></div>
        <div className='w-full border-b-2'><input placeholder='Password' className='p-4 text-black border-none focus:ring-0 focus:outline-0 rounded-sm text-clip border-b-2'></input></div>
        <div className='flex justify-between'><button className='bg-red-500 w-1/3 p-3 text-white rounded-sm'>Log In</button>
        <button className='text-red-500'>Forgot Password?</button>
        
        </div>
        </div>
      </div>
    </div>
  )
}

export default page
