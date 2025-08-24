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
      className="bg-purple-600 hover:bg-purple-700 text-amber-300 px-6 py-2 rounded mt-4"
    >
      Buy Now
    </button>
  );
}
