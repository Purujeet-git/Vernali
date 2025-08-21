'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';
import CartQuantity from "./CartQuantity";
import { useRouter } from 'next/navigation';



const SidebarCart = ({ isOpen, onClose,cartOpen,setCartOpen }) => {
  const router = useRouter();

  
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const FREE_SHIPPING_THRESHOLD = 65;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);



  useEffect(() => {
    const fetchCart = async () => {
      if (session?.user?.email) {
        const res = await fetch('/api/cart/get', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: session.user.email })
        });
        const data = await res.json();
        // console.log("The data is");
        setCartItems(data.cart || []);
      }
    };

    fetchCart();
  }, [session]);


  const handleDelete = async (id) => {
    try {
      // console.log("This is the id", id);
      const res = await fetch('/api/cart/delete', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: id })
      });

      if (res.ok) {
        setCartItems(prev => prev.filter(item => item._id !== id));
      } else {
        // console.error("Delete failed:", await res.json());
      }
    } catch (err) {
      // console.error("Failed to delete cart items", err);
    }
  }

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch('/api/cart/update', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: newQuantity, userEmail: session?.user?.email, })
      });

      if (!res.ok) {

        const error = await res.json();
        // console.error("Failed to update quantity", error);
      }
    } catch (err) {
      // console.error("Failed to update quantity", err);
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
    localStorage.setItem('checkOutData', JSON.stringify({
      cartItems,
      total:subtotal,
    }))
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-yellow-200/45 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full text-amber-200 sm:w-[400px] bg-purple-900 z-50 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Free Shipping Notice */}
        <div className="p-4">
          <p className="text-sm">
            You are <strong>${remaining.toFixed(2)}</strong> away from{' '}
            <span className="text-green-600 font-semibold">free shipping</span>.
          </p>
          <div className="w-full h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 bg-yellow-800 rounded"
              style={{
                width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="px-4 flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartQuantity
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {/* Subtotal & Checkout */}
        <div className="mt-auto px-4 py-6 border-t">
          <div className="flex justify-between text-lg font-medium mb-4">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <p className="text-xs  mb-3">
            Shipping & taxes calculated at checkout
          </p>
          <button onClick={handleCheckout} className="w-full bg-yellow-400 text-black py-3 font-semibold rounded">
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
