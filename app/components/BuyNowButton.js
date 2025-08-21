'use client';
import { useRouter } from 'next/navigation';

export default function BuyNowButton({ product }) {
  const router = useRouter();

  const handleBuyNow = () => {
    // Pass product ID in query to checkout
    router.push(`/checkout?productId=${product._id}`);
  };

  return (
    <button
      onClick={handleBuyNow}
      className="bg-blue-600 px-5 py-2 rounded-xl text-white hover:bg-blue-500"
    >
      Buy Now
    </button>
  );
}
