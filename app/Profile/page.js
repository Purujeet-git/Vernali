'use client'
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
const page = () => {
  const [user1, setuser1] = useState("SignIn")
  const [imageSrc, setImageSrc] = useState(null);

  const { data: session, status } = useSession()


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await res.json();
    if (data.success) {
      alert("User data saved successfully!");
    } else {
      alert("Error saving user data!");
    }
  };

  // useEffect(() => {
  //     if (session?.user?.name) {
  //       setuser1(session.user.name);
  //     }
  //     if (session?.user?.image) {
  //       setImageSrc(session.user.image);
  //     }
  //   }, [session]);
  return (

    <>
      <div className='flex'>
        
        <div className='my-16 mx-1 bg-white w-2/3'>
          <div className='m-10 text-black'><p className=' font-bold text-xl my-4'>Personal Information</p>
            {/* <div className='flex gap-4'>
              <input className='border p-4 w-1/3 rounded-sm' />
              <input className='border p-4 w-1/3 rounded-sm ' />
            </div>
            <div className='py-5 pb-10'>
              <p className='text-sm'>Your Gender</p>
              <div className='flex gap-4 text-gray-600'>
              <div className='flex'><input type='radio' placeholder='Female' /><p>Male</p></div>
              <div className='flex'><input type='radio' placeholder='Female' /><p>Female</p></div>
              </div>
            </div>
            <div className='flex flex-col gap-8 pb-8'>
              <p>Email Address</p>
              <input placeholder='purujeetkr2005@gmail.com' className='w-1/3 border p-4 rounded'/>
            </div>
            <div className='flex flex-col gap-8 pb-8'>
              <p>Mobile Number</p>
              <input placeholder='+91 70XXXXXX61' className='w-1/3 border p-4 rounded'/>
            </div>
            <div> */}
            <form onSubmit={handleSubmit}>
      <h2>Personal Information</h2>
      
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      
      <label>Gender:</label>
      <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
      <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female

      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Mobile Number" onChange={handleChange} required />

      <button type="submit">Save</button>
    </form>
</div>
          </div>
        </div>
      {/* </div> */}
    </>
  )
}

export default page
