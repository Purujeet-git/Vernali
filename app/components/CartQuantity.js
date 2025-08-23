// CartItem.js
import { useState } from "react";
import Image from "next/image";

const CartItem = ({ item, onDelete, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityUpdate = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    onQuantityChange(item._id, newQty);
  };

  return (
    <div className="flex gap-4 items-center border-b py-3">
      <Image height={200} width={500} src={item.image} alt={item.productName} className="w-16 h-16 object-cover" />
      <div className="flex-1">
        <p className="font-medium">{item.productName}</p>
        <p className="text-sm text-gray-500">{item.variant}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => handleQuantityUpdate(quantity - 1)}
            className="px-2 py-1 bg-gray-300"
          >–</button>
          <span>{quantity}</span>
          <button
            onClick={() => handleQuantityUpdate(quantity + 1)}
            className="px-2 py-1 bg-gray-300"
          >+</button>
        </div>
      </div>
      <p>${item.price}</p>
      <button
        onClick={() => onDelete(item._id)}
        className="bg-red-500 text-white px-2 py-1"
      >
        Delete
      </button>
    </div>
  );
};

export default CartItem;
