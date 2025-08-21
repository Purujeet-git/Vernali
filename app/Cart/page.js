'use client'

import { useEffect,useState } from "react";
import Image from "next/image";
import { Router } from "next/router";

export default function CartPage(){
  const [cartItems, setcartItems] = useState([]);
  // const [editMode, seteditMode] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart/get');
      const data = await res.json();
      setcartItems(data);
    };
    fetchCart();
  }, []);

  // const handleUpdate = async () => {
  //   for(let item of cartItems ){
  //     await fetch('/api/cart/update',{
  //       method:'POST',
  //       headers:{'Content-Type':'application/json'},
  //       body:JSON.stringify({productId: item._id,quantity:item.quantity}),
  //     });
  //   }
  //   seteditMode(true);
  //   alert("Cart Updated! You can now delete items.");
  // };

  const handleDelete = async (id,index) => {
    await fetch('/api/cart/delete',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({productId:id}),
    });
    setcartItems(prev => prev.filter((_,i)=> i !== index));
  };

  const total = cartItems.reduce((sum,item) => sum + item.price * item.quantity,0);

  const handleCartCheckout = () => {
    Router.push(`/payment?amount=${totalAmount}`);
  }



   return (
    <div className='mx-16 text-black'>
      <h1 className='py-16'>Home / <span className='font-bold'>Cart</span></h1>
      {/* <button onClick={handleUpdate} className='border border-black p-4 mb-4'>Update Cart</button> */}

      <div className="grid grid-cols-5 gap-4 bg-gray-100 p-4 font-bold">
        <div>Product</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Subtotal</div>
      </div>

      {cartItems.map((item, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b items-center ">
          <div className="flex h-[12vh] items-center gap-2">
            <img src={item.image} alt={item.productName} className="h-16 w-16 object-cover" />
            <p>{item.productName}</p>
          </div>
          <div>₹{item.price}</div>
          <div>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={async (e)=>{
                const newQuantity = parseInt(e.target.value);
                const updatedItems = cartItems.map((ci,idx)=> idx===i?{...ci,quantity:newQuantity}:ci);
                setcartItems(updatedItems);

                await fetch('/api/cart/update',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    productId:item._id,
                    quantity:newQuantity
                  })
                });
              }}
              className="border w-16 text-center"
            />
          </div>
          <div>₹{item.price * item.quantity}</div>
          
          <div>
            <button
              onClick={() => handleDelete(item._id, i)}
              className="bg-red-400 text-white px-2 py-1 rounded col-span-4"
            >
              DELETE
            </button>
          </div>
          
        </div>
      ))}

      <div className='mt-8'>
        <h2 className='text-xl font-bold'>Cart Total: ₹{total}</h2>
      </div>
      <button onClick={handleCartCheckout}>CheckOut</button>
    </div>
  );
}