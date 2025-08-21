'use client';
import React, { useState } from 'react';
import Link from "next/link";

const AdminSidebar = () => {
  const [orderhover, setorderhover] = useState(false);

  return (
    <div className='w-1/4 bg-black flex flex-col items-center font-mono text-white text-xl gap-4 relative'>
      <Link href={"./admin_dashboard"}>
        <p className="my-4">Dashboard</p>
      </Link>

      {/* Orders Link with hover */}
      <div
        onMouseEnter={() => setorderhover(true)}
        onMouseLeave={() => setorderhover(false)}
        className="relative w-full flex justify-center"
      >
        <p className="my-4 px-32 py-5 hover:bg-gray-600 cursor-pointer">
          Orders
        </p>

        {/* Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-800 rounded-md p-3 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
            orderhover ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
          }`}
        >
          <Link href={"./orders"}>
            <p className="hover:underline">Orders Page</p>
          </Link>
          <Link href={"./orders/received"}>
            <p className="hover:underline">Received Orders</p>
          </Link>
          <Link href={"./shipped"}>
            <p className="hover:underline">Shipped Orders</p>
          </Link>
          <Link href={"./completed"}>
            <p className="hover:underline">Completed Orders</p>
          </Link>
          <Link href={"./returns"}>
            <p className="hover:underline">Return Request</p>
          </Link>
        </div>
      </div>

      <Link href={"/admin_products"}>
        <p className="my-4">Products</p>
      </Link>

      <Link href={"./orders"}>
        <p className="my-4">Orders</p>
      </Link>
      <Link href={"./customers"}>
        <p className="my-4">User</p>
      </Link>
    </div>
  );
};

export default AdminSidebar;
