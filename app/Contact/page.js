import React from 'react'
import Image from 'next/image'


const page = () => {
  return (
    <>
    <p className='m-16'>Home / Contact</p>
    <div className='m-16 text-black flex'>
    <div className='bg-gray-200 shadow-xl w-1/3'>
      
      <div className='p-4'>
        <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
            <div className='bg-red-500 w-fit p-3 rounded-full'><Image className=' invert h-[35px] w-[35px]' src={"/call.png"} height={50} width={50} alt='Call'/></div>
            <p>Call To Us</p>
        </div>
        <p className='text-sm font-extralight'>We are available 24/7, & days a week.</p>
        <p className='text-sm font-extralight'>Phone: +088856515154</p>
        </div>
      </div>
      <div className='h-0.5 m-4 w-[90%] bg-gray-400'></div>
      <div className='p-4'>
        <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
            <div className='bg-red-500 w-fit p-3 rounded-full'><Image className=' invert h-[35px] w-[35px]' src={"/mail.png"} height={50} width={50} alt='Call'/></div>
            <p>Write to Us</p>
        </div>
        <p className='text-sm font-extralight'>Fill Out the form and we will contact you within 24 hours.</p>
        <p className='text-sm font-extralight'>Emails: customer@exclusive.com</p>
        <p className='text-sm font-extralight'>Emails: support@exclusive.com</p>
        </div>
      </div>
      </div>
      <div className='mx-16 p-8 bg-gray-200 shadow-xl'>
        <div className=' flex gap-5'>
            <input className='bg-white rounded-sm p-4' placeholder='Your Name'></input>
            <input className='bg-white rounded-sm p-4' placeholder='Your Email'></input>
            <input className='bg-white rounded-sm p-4' placeholder='Your Phone'></input>
        </div>
        <textarea placeholder='Your Message' className='bg-white p-4 my-4 h-[30vh] w-full rounded-sm'></textarea>
      </div>
    </div>
    </>
  )
}

export default page
