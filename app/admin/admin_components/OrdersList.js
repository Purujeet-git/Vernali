'use client';

import { useEffect, useState } from "react";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function OrdersList({ orders,status }) {
  const [formattedDates, setFormattedDates] = useState({});

  const [ordersState, setOrdersState] = useState(
    orders.map((order) => ({
      ...order,
      trackingNumberInput: "",
      courierSlugInput: "",
    }))
  );
  
  

  useEffect(() => {
    const newDates = {};
    orders.forEach(order => {
      if (order.orderStatus === 'delivered' && order.deliveredAt) {
        newDates[order._id] = formatDate(order.deliveredAt);
      }
    });
    setFormattedDates(newDates);
  }, [orders]);

  const handleInputChange = (orderId, field, value) => {
    setOrdersState((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  async function markAsReceived(orderId) {
    try {
      const res = await fetch('/api/admin/orders/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          newStatus: "order received",
        }),
      });

      if (res.ok) {
        alert('Order marked as received');
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert("Failed to update status. " + errorData.error);
      }

    } catch (err) {
      // console.error(err);
      alert("Something went wrong.");
    }
  }

  async function updateStatus(orderId, newStatus, trackingNumber = null, courierSlug = null) {
    try {
      if (newStatus === "Shipped" && (!trackingNumber || !courierSlug)) {
        alert('Please provide both tracking number and courier slug.');
        return;
      }

      const res = await fetch('/api/admin/orders/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus, trackingNumber, courierSlug }),
      });

      if (res.ok) {
        alert(`Order marked as ${newStatus}`);
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert("Failed to update status. " + errorData.error);
      }
    } catch (err) {
      // console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div>
      {ordersState.map((order, index) => (
        <div key={index} className="border p-4 m-4 rounded shadow">
          <p><strong>Customer:</strong> {order.name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>

          <div className="flex gap-10 mt-2">
            <p>Name: {order.items[0]?.productName}</p>
            <p>Quantity: {order.items[0]?.quantity}</p>
            <p>Price: ₹{order.items[0]?.price}</p>
          </div>

          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Order Status:</strong> {order.orderStatus}</p>
          <p><strong>Payment ID:</strong> {order.razorpayPaymentId}</p>

          {order.orderStatus === "Processing" && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => markAsReceived(order._id)}
            >
              Mark as Received
            </button>
          )}

          {order.orderStatus === "order received" && (
            <div>
              <input
                type="text"
                className="border p-2 w-full mb-2"
                placeholder="Tracking Number"
                value={order.trackingNumberInput || ""}
                onChange={(e) => handleInputChange(order._id, "trackingNumberInput", e.target.value)}
              />

              <select
                className="border p-2 w-full mb-2"
                value={order.courierSlugInput || ""}
                onChange={(e) => handleInputChange(order._id, "courierSlugInput", e.target.value)}
              >
                <option value="">Select Courier</option>
                <option value="testing-courier">Testing Courier</option>
                <option value="delhivery">Delhivery</option>
                <option value="bluedart">BlueDart</option>
                <option value="ekart">Ekart</option>
              </select>

              <button
                onClick={() =>
                  updateStatus(order._id, "Shipped", order.trackingNumberInput, order.courierSlugInput)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Mark as Shipped
              </button>
            </div>
          )}

          {order.orderStatus === "Shipped" && (
            <button
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => updateStatus(order._id, "delivered")}
            >
              Mark as Delivered
            </button>
          )}

          {order.orderStatus === "delivered" && formattedDates[order._id] && (
            <p><strong>Delivered On:</strong> {formattedDates[order._id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
