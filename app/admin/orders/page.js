'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OrdersList from "../admin_components/OrdersList";
import AdminSidebar from "../admin_components/AdminSidebar";
import OrderPage from "../admin_components/OrderPage";

export default function NewOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin'); // Redirect to login
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'loading' || !session) return;

    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders?status=Processing', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session, status, router]);

  // Function to refresh orders
  const refreshOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders?status=Processing', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        router.push('/auth/signin');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading' || (status === 'unauthenticated' && loading)) {
    return (
      <div className="p-10 text-black">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session || session.user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="p-10 text-black">
        <AdminSidebar />
        <h2 className="text-2xl font-bold mb-4">🆕 New Orders (Processing)</h2>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-black">
        <AdminSidebar />
        <h2 className="text-2xl font-bold mb-4">🆕 New Orders (Processing)</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading orders:</p>
          <p>{error}</p>
          <button 
            onClick={refreshOrders}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 text-black">
      <AdminSidebar />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🆕 New Orders (Processing)</h2>
        <button 
          onClick={refreshOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <OrderPage status="Processing"/>
      {orders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-8 rounded text-center">
          <p className="text-lg">No processing orders found</p>
          <p className="text-sm mt-2">New orders will appear here when customers place them.</p>
        </div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  );
}