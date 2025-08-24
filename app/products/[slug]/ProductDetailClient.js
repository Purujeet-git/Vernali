// app/products/[slug]/ProductDetailClient.jsx (Client Component)
"use client";
import { useState } from "react";
import ProductDetailCarousel from "@/app/components/ProductDetailCarousel";
import BuyNowButton from "@/app/components/BuyNowButton";
import AddToCartButton from "@/app/components/AddToCartButton";
import DeleteButton from "@/app/components/DeleteButton";
import Image from "next/image";
export default function ProductDetailClient({ product, isUserAdmin, imagesByColor, defaultColor }) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  return (
    <div className="text-amber-200 bg-black p-6">
      <div className="bg-black border-2 border-white flex flex-col md:flex-row rounded-lg overflow-hidden">
        
        {/* Carousel */}
        <div className="md:w-1/2 h-full">
          <ProductDetailCarousel images={imagesByColor[selectedColor]} />
        </div>

        {/* Details */}
        <div className="bg-black md:w-1/2 p-4 flex flex-col justify-between">
          <h1 className="text-4xl text-purple-600 font-bold text-center bg-amber-300 p-2">
            {product.productName}
          </h1>
          

          {/* Color swatches */}
          <div className="mt-4 flex gap-3">
            {product.colors?.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                  selectedColor === color ? "border-yellow-400" : "border-gray-400"
                }`}
              >
                <Image 
                height={5000}
                width={5000}
                  src={imagesByColor[color]?.[0] || "/placeholder.jpg"}
                  alt={color}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <h2 className="text-2xl text-amber-400 mt-4 mb-2">Product Description</h2>
          <p className="text-white">{product.description}</p>

          <div className="mt-6 ">
            <p className="text-3xl text-yellow-200 mt-4">₹{product.price}</p>
            <div className="flex m-4 gap-5">
            <BuyNowButton product={product} />
            <AddToCartButton product={product} />
            </div>
          </div>

          {isUserAdmin && <DeleteButton productId={product._id} />}
        </div>
      </div>
    </div>
  );
}
