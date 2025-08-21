'use client'

import { useState } from "react"

export default function AddToCartButton({product}) {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);
        const res = await fetch('/api/cart/add',{
            method:"POST",
            body:JSON.stringify({
                productId:product._id,
                name:product.name,
                price:product.price,
                image:product.images?.[0] || '',
                quantity:1,
            }),
            headers:{
                'Content-Type':'application/json'
            }
        });

        setLoading(false);
        if(res.ok){
            setAdded(true);
        }
    };

    return(
        <button
        onClick={handleAddToCart}
        disabled={loading || added}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-4"
        >
            {loading ? 'Adding...':added ?"Added to Cart":"Add to Cart"}
        </button>
    );
}
