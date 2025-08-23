'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReturns() {
      try {
        const res = await axios.get('/api/admin/returns/all');
        setRequests(res.data);
      } catch (error) {
        // console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchReturns();
  }, []);

  async function updateRequest(id, status, resolutionType = '', rejectionNote = '') {
    try {
      await axios.put(`/api/admin/returns/${id}`, {
        status,
        resolutionType,
        rejectionNote,
      });
      alert('Request updated successfully!');
      window.location.reload();
    } catch (err) {
      // console.error(err);
      alert('Failed to update request.');
    }
  }

  if (loading) return <div>Loading return requests...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Return Requests</h1>
      {requests.map((req) => (
        <div key={req._id} className="border p-4 mb-4 rounded shadow">
          <p><strong>Order ID:</strong> {req.orderId}</p>
          <p><strong>Product:</strong> {req.productName}</p>
          <p><strong>User:</strong> {req.userEmail}</p>
          <p><strong>Reason:</strong> {req.reason}</p>
          <p><strong>Damaged:</strong> {req.damaged ? 'Yes' : 'No'}</p>
          <p><strong>Comment:</strong> {req.comment}</p>
          {req.photoUrl && (
            <div>
              <p><strong>Photo:</strong></p>
              <Image src={req.photoUrl} height={500} width={500} alt="Return Proof" className="w-32 h-32 object-cover border" />
            </div>
          )}
          <p><strong>Status:</strong> {req.status}</p>

          {req.status === 'pending' && (
            <div className="mt-4 space-y-2">
              <div>
                <label className="font-semibold mr-2">Resolution:</label>
                <select id={`resolution-${req._id}`} className="border p-1">
                  <option value="">Select</option>
                  <option value="refund">Refund</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>
              <button
                onClick={() =>
                  updateRequest(
                    req._id,
                    'approved',
                    document.getElementById(`resolution-${req._id}`).value
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>

              <div>
                <textarea
                  id={`reject-note-${req._id}`}
                  className="border w-full p-2 mt-2"
                  placeholder="Rejection note (optional)"
                />
                <button
                  onClick={() =>
                    updateRequest(
                      req._id,
                      'rejected',
                      '',
                      document.getElementById(`reject-note-${req._id}`).value
                    )
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
