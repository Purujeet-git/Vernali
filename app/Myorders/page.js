'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

export default function Myorders() {
  const { data: session, status } = useSession();
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);

  function isWithinReturnWindow(deliveredAt) {
    if (!deliveredAt) {
      // console.log("No delivery date");
      return false;
    }


    const deliveredDate = new Date(deliveredAt);
    const now = new Date();
    // console.log("Delivered At:", deliveredAt, new Date(deliveredAt));

    const diffDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);
    // console.log("Days since delivery:", diffDays);

    return diffDays <= 7;
  }

  useEffect(() => {
    if (session?.user?.email) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`/api/orders/user?email=${session.user.email}`);
          setorders(res.data);
        } catch (err) {
          // console.error(err);
        } finally {
          setloading(false);
        }
      }
      fetchOrders();
    }
  }, [session]);


  if (status === 'loading' || loading) return <div className="p-4 bg-black text-purple-500">Loading orders...</div>;
  if (!session) return <div className="p-4">Please login to view your orders.</div>;

  return (
    <div className="p-6 w-full mx-auto text-amber-200 flex flex-col items-center bg-black w">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 w-2/3 mb-4 rounded-lg shadow-md">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <div className="mt-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-t pt-2 mt-2">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p>Qty: {item.quantity} | Price: ₹{item.price}</p>
                    {/* Show Return button if status = 'delivered' and within 7 days */}
                    {/* {console.log("Return eligibility:", {
                      deliveredAt: order.deliveredAt,
                      status: order.orderStatus,
                      isEligible: isWithinReturnWindow(order.deliveredAt),
                    })} */}
                    {order.orderStatus?.toLowerCase() === 'delivered' && isWithinReturnWindow(order.deliveredAt) && (
                      <a
                        href={`/returns/request?orderId=${order._id}&productId=${item._id}`}
                        className="text-blue-600 underline"
                      >
                        Request Return
                      </a>
                    )}


                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Utility function to check return window (e.g., 7 days)
