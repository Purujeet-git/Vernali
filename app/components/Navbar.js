'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, ShoppingCart, Variable } from 'lucide-react';
import { useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import SidebarCart from './SideBarCart';
import { Pacifico as PacificoFont } from 'next/font/google';
const pacifico = PacificoFont({
  subsets: ['latin'],
  variable: '--font-pacifico',
  weight: '400',
});




const Navbar = () => {
  const [user1, setuser1] = useState("SignIn")
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession()
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setcategories] = useState(false);
  const [profile, setProfile] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setuser1(session.user.name);
    }
  }, [session]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };


  return (
    <>
      <div className='bg-violet-500 text-amber-200 flex h-[10vh] justify-between' >
        <div className='flex justify-center items-center text-2xl w-1/5'><p className={`${pacifico.className} font-sans`}><Link href={"/"}>Vernali</Link></p></div>
        <div className='flex justify-center items-center w-1/2'>
          <ul className='flex justify-evenly  w-full font-sans'>
            <li><Link href={"/"} className='hover:underline '>Home</Link></li>
            <li><Link href={"/Contact"} className='hover:underline'>Contact</Link></li>
            <li><Link href={"/"} className='hover:underline'>About</Link></li>
            <li className='relative'><p onMouseEnter={() => setcategories(true)} >Categories</p>
              {categories ? <div onMouseLeave={() => setcategories(false)} className="absolute min-w-[15rem] top-full mt-1 bg-black shadow-lg rounded-md p-10 z-50">
                <ul className=' '>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Woman-Fashion"} prefetch={true}>Women's Fashion</Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Men-Fashion"} prefetch={true}>Men's Fashion </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Electronics"} prefetch={true}>Electronics </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Home-and-Lifestyle"} prefetch={true}>Home & Lifestyle </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Medicine"} prefetch={true}>Medicine </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Sports-and-Outdoor"} prefetch={true}>Sports & Outdoor </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Baby-And-Toys"} prefetch={true}>Baby's & Toys </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Groceries-and-Pets"} prefetch={true}>Groceries & Pets </Link></li>
                  <li className="p-1 cursor-pointer"><Link href={"/category/Health-and-Beauty"} prefetch={true}>Health & Beauty </Link></li>
                </ul>
              </div> : ""}

            </li>

            <li><Link href="/Myorders">
              <p className="hover:underline">My Orders</p>
            </Link></li>
            <li><Link href="/returns">My Returns</Link></li>
            <li>
              {status === "loading" ? (
                <p>Loading...</p>
              ) : session ? (
                session.user.role !== "admin" ? (
                  <div><p className='relative' onMouseEnter={() => { setProfile(true) }}>Hey {session.user.name}</p>
                    {profile ?
                      <div onMouseLeave={()=>{setProfile(false)}} className=' flex flex-col bg-black absolute top-16 left-[53vw] rounded-xl p-2 z-10'>
                        <p className='flex '><Image className='m-2 rounded-4xl' src={`${session.user.image}`} height={50} width={50} alt='Profile Image' /> <p className='pt-5'>{session.user.name}</p></p>
                        <p>{session.user.email}</p>
                        <button
                          onClick={() => signOut()}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 mt-2 transition"
                        >
                          Logout
                        </button>
                      </div>
                      : ""}
                  </div>
                ) : (
                  <Link href="/admin/admin_dashboard">Hey {session.user.name}</Link>
                )
              ) : (
                <Link href="/Signup" className="hover:underline">
                  Sign Up
                </Link>
              )}
            </li>
          </ul>
        </div>
        <div className='flex w-1/3 gap-5 items-center'>
          <form onSubmit={handleSearch}>
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='bg-black text-amber-300 w-2/3 p-3 border-none rounded-xl'
            />
            <button type="submit" className="ml-2 px-3 py-1 bg-black text-white rounded">Search</button>
          </form>
          <button className='cursor-pointer' onClick={() => router.push('/Wishlist')}>
            <Heart />
          </button>
          <button className='cursor-pointer' onClick={() => setCartOpen(true)}>
            <ShoppingCart />
          </button>

          <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} setCartOpen={setCartOpen} cartOpen={cartOpen} />
        </div>
      </div>
    </>
  )
}

export default Navbar
