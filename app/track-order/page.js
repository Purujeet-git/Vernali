'use client';
import { useEffect,useState } from "react";
import Link from "next/link";
import { number } from "zod";

export default function TrackOrderPage() {
    const [orders, setOrders] = useState([]);
    const [trackingData, setTrackingData] = useState({});

    useEffect(() => {
      fetch("/api/orders/shipping")
        .then(res => res.json())
        .then(data => setOrders(data));
    
    }, []);

    const fetchTracking = async (slug, number) => {
        try{
            const res = await fetch(`/api/tracking/${number}?slug=${slug}`);
            const data = await res.json();
            setTrackingData(prev => ({...prev, [number]:data}));
           
        }catch(error){
            // console.error(error);
        }
    };
    


    return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Your Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p><strong>Order:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          
          {order.trackingNumber && order.courierSlug && (
            <button
              className="text-blue-500 underline"
              onClick={() => fetchTracking(order.courierSlug, order.trackingNumber)}
            >
              View Live Tracking
            </button>
          )}

          {trackingData[order.trackingNumber] && (
            <div className="mt-2 text-sm text-gray-700">
              <p><strong>Current Status:</strong> {trackingData[order.trackingNumber].tag}</p>
              <p><strong>Checkpoint:</strong> {trackingData[order.trackingNumber].checkpoints?.[0]?.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

}