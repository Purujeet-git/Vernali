// app/components/DeleteButton.jsx
'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ productId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const res = await fetch(`/api/products/${productId}/delete`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (data.success) {
      alert('Product deleted successfully');
      router.push('/');
    } else {
      alert('Delete failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 mt-4 px-5 py-2 rounded-xl text-white font-mono hover:bg-red-500 hover:shadow-lg"
    >
      Delete Product
    </button>
  );
}
