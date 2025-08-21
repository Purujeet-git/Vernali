"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const CustomerDetailsPage = () => {
  const params = useParams();
  const customerId = params.id;

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);



  const toggleAccountStatus = async () => {
    const newStatus = customer.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        alert(`Account ${newStatus === "active" ? "enabled" : "disabled"} successfully`);
      }

    } catch (err) {
      // console.error("Failed to toggle account status:", err);
      alert("Failed to update account status.");
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/admin/customers/${customerId}`);
        const data = await res.json();
        if (data.success) {
          setCustomer(data.customer);
          setOrders(data.orders);
          setReturns(data.returns);
          setTotalSpent(data.totalSpent);
          setNotes(data.customer.adminNotes || "");
        }
      } catch (error) {
        // console.error("Failed to fetch customer details:", error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes }),
      });
      alert("Notes saved successfully");
    } catch (err) {
      // console.error("Error saving notes:", err);
      alert("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  if (!customer) {
    return <div className="p-6">Loading customer details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Gender:</strong> {customer.gender}</p>
        <p><strong>Role:</strong> {customer.role}</p>
        <p><strong>Account Created:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Admin Notes */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Admin Notes</h2>
        <textarea
          className="w-full border rounded p-2"
          rows="4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-6">
          <button
            onClick={toggleAccountStatus}
            className={`${customer.status === "active" ? "bg-red-500" : "bg-green-500"
              } text-white px-4 py-2 rounded`}
          >
            {customer.status === "active" ? "Disable Account" : "Enable Account"}
          </button>
        </div>
        <button
          onClick={saveNotes}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          disabled={savingNotes}
        >
          {savingNotes ? "Saving..." : "Save Notes"}
        </button>
      </div>

      {/* Purchase History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Purchase History</h2>
        <p><strong>Total Spent:</strong> ₹{totalSpent}</p>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="border p-2 my-2 rounded">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))
        ) : (
          <p>No purchases found.</p>
        )}
      </div>

      {/* Return Requests */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Return Requests</h2>
        {returns.length > 0 ? (
          returns.map((req) => (
            <div key={req._id} className="border p-2 my-2 rounded">
              <p><strong>Request ID:</strong> {req._id}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
            </div>
          ))
        ) : (
          <p>No return requests found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
