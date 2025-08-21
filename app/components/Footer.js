import React from 'react';

const Footer = () => {
  return (
    <div className='bg-black pt-28 pb-16 flex justify-center text-white'> {/* Removed relative bottom-0 */}
      <div className='w-1/6 flex flex-col mx-5 items-start gap-6'> {/* Removed justify-center as it's already aligned by flex */}
        <p className='text-2xl font-bold'>Exclusive</p>
        <p className='text-xl font-bold'>Subscribe</p>
        <p className='text-xl'>Get 10% off your first order</p>
        <input placeholder='Enter Your Email' className='w-full p-3 border border-white text-white bg-black focus:outline-none'></input> {/* Added border and focus outline */}
      </div>
      <div className='w-1/6 flex flex-col mx-5 items-start gap-6'>
        <p className='text-2xl font-bold'>Support</p>
        <p className='text-xl font-bold'>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
        <p>exclusive@gmail.com</p>
        <p>+88015-88888-9999</p>
      </div>
      <div className='w-1/6 flex flex-col mx-5 items-start gap-6'>
        <p className='text-2xl'>Account</p>
        <p>My Account</p>
        <p>Login / Register</p>
        <p>Cart</p>
        <p>WishList</p>
      </div>
      <div className='w-1/6 flex flex-col mx-5 items-start gap-6'>
        <p>Quick Link</p>
        <p>Privacy Policy</p>
        <p>Terms Of Use</p>
        <p>FAQ</p>
        <p>Contact</p>
      </div>
    </div>
  );
};

export default Footer;