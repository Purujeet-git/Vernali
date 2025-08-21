'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ReturnRequestPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');
    const [damaged, setDamaged] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let photoUrl = '';

        // Step 1: Upload Photo to Blob via API Route
        if (photo) {
            const formData = new FormData();
            formData.append('file', photo);

            try {
                setUploading(true);
                const res = await fetch('/api/returns/blob-upload-url', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error('Photo upload failed');
                const data = await res.json();
                photoUrl = data.url;
            } catch (err) {
                // console.error(err);
                alert('Photo upload failed');
                setUploading(false);
                return;
            }
        }

        // Step 2: Submit Return Request to MongoDB API
        try {
            const res = await fetch('/api/returns/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason,
                    comment,
                    damaged,
                    photoUrl,
                    orderId: orderId,
                    productId: productId,
                    userEmail: userEmail,
                }),
            });

            if (!res.ok) throw new Error('Failed to submit return request');
            alert('Return request submitted successfully!');
        } catch (err) {
            // console.error(err);
            alert('Return request failed');
        } finally {
            setUploading(false);
        }
    };
    if (!orderId || !productId || !userEmail) {
        return <p className="text-red-600">Missing order or user information.</p>;
    }
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Return a Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Why are you returning this item?</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">Select a reason</option>
                        <option value="wrong-item">Received wrong item</option>
                        <option value="damaged">Product was damaged</option>
                        <option value="late">Arrived too late</option>
                        <option value="not-expected">Quality not as expected</option>
                        <option value="size-issue">Size or fit issue</option>
                        <option value="changed-mind">Changed my mind</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Was the product damaged?</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="damaged"
                                value="yes"
                                onChange={() => setDamaged(true)}
                            />{' '}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="damaged"
                                value="no"
                                onChange={() => setDamaged(false)}
                            />{' '}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Additional Comments</label>
                    <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Upload a photo (optional)</label>
                    <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {uploading ? 'Submitting...' : 'Submit Return Request'}
                </button>
            </form>
        </div>
    );
}
