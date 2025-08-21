"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
export default function CategoryPage() {
  const { slug } = useParams(); // 👈 grabs [slug] from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      try {
        
        const res = await fetch(`/api/products/category/${slug}`);
        const data = await res.json();
        // console.log("Fetched products:", data);
        setProducts(data);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) return <p className="p-4"><LoadingSpinner/></p>;

  return (
    <div className="p-4 bg-black">
      <h1 className="text-xl font-bold text-amber-300 mb-4">Category: {slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {products.length > 0 ? (
    products.map(product => {
      // Get the first available image (from the first color key)
      const firstColor = Object.keys(product.images || {})[0];
      const firstImage = firstColor ? product.images[firstColor][0] : null;

      return (
        <div key={product._id} className="border p-2 bg-violet-600 rounded text-amber-300">
          <Link href={`/products/${product._id}`}>
            {firstImage && (
              <Image
                src={firstImage}
                width={700}
                height={700}
                alt={product.productName}
                className="w-full h-40 object-cover border border-white bg-white"
              />
            )}
            <h2 className="text-lg font-semibold">{product.productName}</h2>
            <p>₹{product.price}</p>
          </Link>
        </div>
      );
    })
  ) : (
    <p>No products found in this category.</p>
  )}
</div>

    </div>
  );
}
