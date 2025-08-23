'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [cartData, setCartData] = useState({ cartItems: [], total: 0 });

  useEffect(() => {
    const storedData = localStorage.getItem('checkOutData');
    if (storedData) {
      setCartData(JSON.parse(storedData));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all details');
      return;
    }
    // console.log("Frontend Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    // 1. Create Razorpay Order (Backend API Call)
    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartData.cartItems,
        userEmail: session?.user?.email || '',
        amount: cartData.total * 100, // Amount in paise
      }),
    });

    const orderData = await res.json();
    if (!orderData.id) {
      alert('Failed to create Razorpay Order');
      return;
    }

    // 2. Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Your Store Name',
      description: 'Order Payment',
      order_id: orderData.id,
      handler: async function (response) {
        // 3. On Payment Success → Verify Payment Signature
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert('Payment Successful & Verified!');
          localStorage.removeItem('checkOutData'); // Clear Cart Data
          router.push('/order-confirmation'); // Redirect to Confirmation Page
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: formData.name,
        email: session?.user?.email || '',
        contact: formData.phone,
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-container p-8 text-black">
      <h2 className="text-2xl mb-4">Billing Details</h2>
      <div className="flex gap-8">
        {/* Left - Address Form */}
        <div className="w-2/3">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border"
          />
          <input
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleInputChange}
            className="block w-full mb-4 p-3 border"
          />
        </div>

        {/* Right - Cart Summary */}
        <div className="w-1/3 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          {cartData.cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>
                <Image src={item.image} height={100} width={100} alt='image' />
                </span>

              <span>{item.productName} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{cartData.total}</span>
          </div>
          <button
            onClick={handlePayment}
            className="mt-4 w-full bg-red-500 text-white py-3 rounded"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
 