'use client'

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import AdminSidebar from "../admin_components/AdminSidebar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Router } from "next/router"


export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user1, setuser1] = useState("SignIn");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, settopProducts] = useState([]);
  const [salesRange, setsalesRange] = useState("day");
  const [topProductsRange, settopProductsRange] = useState("day");
  const [latestOrders, setlatestOrders] = useState([]);
  const [authorized, setAuthorized] = useState(false);

  
  useEffect(() => {
    if (status === 'loading') return <p> Loading ...</p>;


    if (session?.user?.name) {
      setuser1(session.user.name);
    }
    if (!session) {

      router.replace('/Profile');
      return; // Redirect to login if no session
    } else if (session.user.role !== 'admin') {
      router.replace('/Profile');
      return; // Redirect non-admin users to their dashboard
    }

    setAuthorized(true);
  }, [session, status,router]);
  


  

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(`/api/admin/dashboard/top-products?range=${topProductsRange}`);
        const json = await res.json();
        if (json.success) {
          settopProducts(json.topProducts);
        }
      } catch (err) {
        // console.error("Failed to load topp products", err);
      }
    };

    fetchTopProducts();
  }, [topProductsRange]);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/dashboard/sales?range=${salesRange}`);
        const json = await res.json();
        // console.log("Sales Resonse:", json);
        if (json.success) {
          setSalesData(json.date);
        }
      } catch (err) {
        // console.error("Failed to fetch sales data:", err);
      }
      setLoading(false);
    };

    fetchSales();
  }, [salesRange]);
  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/latest-orders");
        const json = await res.json();
        if (json.success) {
          setlatestOrders(json.data);
        }
      } catch (error) {
        // console.error("Error fetching latest orders:", err);
      }
    };

    fetchLatestOrders();
  }, []);


  if (status === 'loading') return <p>Loading...</p>


  return (
    <div>
      <p>Welcome, {user1}</p>
      <div className='flex '>
        <AdminSidebar />
        <div className="p-8 space-y-8 text-black w-full">
          <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>

          {/* Filter for Sales Chart */}
          <div className="flex bg-white h-fit rounded-3xl p-10 pb-20">
            <div className="flex flex-col  gap-10 w-full">


              {/* Sales Chart Placeholder */}

              <div className="h-[300px] w-full  pr-12 ">
                <div className="flex  items-center justify-around w-full mb-6">
                  <p className="text-black font-bold">📈 Sales Chart Rendering</p>
                  <select
                    value={salesRange}
                    onChange={(e) => setsalesRange(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded shadow-sm text-sm"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>


                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalSales"
                      stroke="#16a34a"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>
            </div>





            {/* Top Products */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🏆 Top 10 Best Performing Products</h2>
                <select
                  value={topProductsRange}
                  onChange={(e) => settopProductsRange(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div className="w-full overflow-auto shadow rounded-xl">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-200 text-left text-sm font-semibold">
                    <tr>
                      <th className="p-4">#</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Units Sold</th>
                      <th className="p-4">Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-4">{i + 1}</td>
                        <td className="p-4">{product._id}</td>
                        <td className="p-4">{product.unitsSold}</td>
                        <td className="p-4">₹{product.totalSales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          {/* Latest Orders */}
          <div>
            <h2 className="text-xl font-semibold mb-4">🕐 Latest Orders</h2>
            <div className="w-full overflow-auto shadow rounded-xl">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-left text-sm font-semibold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((order, i) => (
                    <tr key={order._id} className="border-t">
                      <td className="p-4">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4">{order.name || "N/A"}</td>
                      <td className="p-4">₹{order.totalAmount}</td>
                      <td className="p-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visitor Statistics */}
          
        </div>
      </div>


    </div>
  );
}