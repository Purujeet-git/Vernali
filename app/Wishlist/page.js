import React from 'react'

const page = () => {
  return (
    <div className='mx-16 text-black'>
      <div className='text-black flex justify-between m-8 items-center'>
        <p className='text-xl'>Wishlist</p>
        <button className='p-5 w-[10vw] border-2 border-black rounded-sm'>Move All to bag</button>
        
      </div>
      <div className='flex items-center justify-center gap-10 '>
        <div><div className='h-[32vh] w-[18vw] bg-amber-700 relative'>
          <button className='absolute bottom-0 w-full text-white hover:cursor-pointer bg-black p-3'><p>Add to cart</p></button>

        </div>
        <p className='font-bold '>Item Name</p>
        <p className='text-red-600 font-bold'>$160</p>

        </div>
        <div><div className='h-[32vh] w-[18vw] bg-amber-700 relative'>
          <button className='absolute bottom-0 w-full text-white hover:cursor-pointer bg-black p-3'><p>Add to cart</p></button>

        </div>
        <p className='font-bold '>Item Name</p>
        <p className='text-red-600 font-bold'>$160</p>

        </div>
        <div><div className='h-[32vh] w-[18vw] bg-amber-700 relative'>
          <button className='absolute bottom-0 w-full text-white hover:cursor-pointer bg-black p-3'><p>Add to cart</p></button>

        </div>
        <p className='font-bold '>Item Name</p>
        <p className='text-red-600 font-bold'>$160</p>

        </div>
        <div><div className='h-[32vh] w-[18vw] bg-amber-700 relative'>
          <button className='absolute bottom-0 w-full text-white hover:cursor-pointer bg-black p-3'><p>Add to cart</p></button>

        </div>
        <p className='font-bold '>Item Name</p>
        <p className='text-red-600 font-bold'>$160</p>

        </div>
      </div>
    </div>
  )
}

export default page
