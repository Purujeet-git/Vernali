'use client';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  const { productSlug, productName, price, images } = product;

  return (
    <Link href={`/product/${productSlug}`} className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="w-full aspect-[4/5] bg-gray-100">
        <Image
        height={1000}
        width={1000}
          src={images?.[0] || '/placeholder.png'}
          alt={productName}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{productName}</h3>
        <p className="text-sm text-gray-700 mt-1">₹{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
