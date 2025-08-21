'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Razorpay from 'razorpay';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const city = searchParams.get('city');
  const street = searchParams.get('street');
  const addressExtra = searchParams.get('addressExtra') || '';
  const fullAddress = `${street}, ${addressExtra}, ${city}`;
  // console.log("Product Name:", productName);
  useEffect(() => {
    if (!price) return;

    const loadRazorpay = async () => {
      const res = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: price }),
      });

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "My E-Commerce",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          const items = [{
            productId,
            productName,
            price: Number(price),
            quantity: 1,
          }];

          await fetch('/api/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              items,
              totalAmount: Number(price),
              name,
              email,
              phone,
              address: fullAddress,
              userEmail: email,
            }),
          });

          router.push('/success');
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    loadRazorpay();
  }, []);

  return (
    <div className="p-10 text-black">
      <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
      <p>Product: {productName}</p>
      <p>Price: ₹{price}</p>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Address: {fullAddress}</p>
    </div>
  );
}
