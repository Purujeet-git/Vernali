'use client';

import { useState,useEffect } from "react";

const OrderPage = ({status}) =>{
    const [orders, setorders] = useState([]);
    const [search, setsearch] = useState('');

    const fetchOrders = async () => {
        const res = await fetch(`/api/admin/orders/search?status=${status}&search=${search}`);
        const data = await res.json();
        setorders(Array.isArray(data.orders) ? data.orders : []);
    };

    useEffect(() =>{
        fetchOrders();
    },[search]);

    return(
        <div>
      <input
        type="text"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setsearch(e.target.value)}
        className="p-2 border rounded mb-4"
      />
      <div>
        {orders.map(order => (
          <div key={order._id} className="p-4 border-b">
            <p>Order ID: {order._id}</p>
            <p>Customer: {order.customerName}</p>
            <p>Status: {order.orderStatus}</p>
            <p>Tracking: {order.trackingNumber}</p>
          </div>
        ))}
      </div>
    </div>
    );
};

export default OrderPage;