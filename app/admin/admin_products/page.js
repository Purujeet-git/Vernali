'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { put } from '@vercel/blob';
import React from 'react';
import Link from 'next/link';
import slugify from 'slugify';
import Image from 'next/image';

const AddProductForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [colorCount, setColorCount] = useState(1); // number of color groups
  const [colorInputs, setColorInputs] = useState([{ color: '', files: [] }]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [customTags, setCustomTags] = useState('');

  const handleColorCountChange = (e) => {
    let count = Math.min(5, parseInt(e.target.value));
    setColorCount(count);
    const newInputs = Array.from({ length: count }, (_, i) => ({
      color: colorInputs[i]?.color || '',
      files: []
    }));
    setColorInputs(newInputs);
  };

  const handleColorNameChange = (index, value) => {
    const updated = [...colorInputs];
    updated[index].color = value;
    setColorInputs(updated);
  };

  const handleColorFileChange = async (index, files) => {
    if (!files.length) return;

    const uploaded = await Promise.all(
      Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/admin/upload?filename=${file.name}`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload file');

        const { url } = await res.json();
        return url;
      })
    );

    const colorName = colorInputs[index].color;
    if (!colorName) return alert('Please enter color name first');

    setUploadedImages((prev) => ({
      ...prev,
      [colorName]: uploaded,
    }));
  };


  const onSubmit = async (data) => {
    const productSlug = slugify(data.name, { lower: true });
    const colors = colorInputs.map((ci) => ci.color);
    const images = uploadedImages;

    const customTags = data.customTags ? data.customTags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      : [];


    const payload = {
      productName: data.name, // ✅ now it matches your Mongoose schema
      price: parseFloat(data.price),
      description: data.description,
      category: data.category,
      quantity: parseInt(data.quantity),
      sizes: data.sizes.split(',').map(s => s.trim()),
      colors,
      images,
      productSlug,
      customTags,
    };

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      alert(`Product "${data.name}" uploaded successfully!`);
      reset();
      setColorInputs([{ color: '', files: [] }]);
      setUploadedImages({});
    } else {
      const errorData = await res.json();
      alert(`Failed: ${errorData.message}`);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    { value: "Woman-Fashion", label: 'Woman Fashion' },
    { value: "Men-Fashion", label: 'Men Fashion' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Home-and-Lifestyle', label: 'Home And Lifestyle' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Sports-and-Outdoor', label: 'Sports and Outdoor' },
    { value: 'Baby-And-Toys', label: "Baby's & Toys" },
    { value: 'Groceries-and-Pets', label: 'Groceries & Pets' },
    { value: 'Health-and-Beauty', label: 'Health & Beauty' },
  ];

  return (
    <div className="flex h-fit min-h-screen">
      <div className="w-1/4 bg-black flex flex-col items-center font-mono text-white text-xl gap-4 p-4">
        <Link href="/admin_dashboard">Dashboard</Link>
        <Link href="/admin_dashboard/orders">Orders</Link>
        <Link href="/admin_dashboard/products">Products</Link>
      </div>
      <div className="mx-1 flex flex-col items-center justify-center bg-white w-2/3 p-6">
        <h2 className='text-black font-bold text-3xl mb-6'>Add New Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl space-y-4">
          <input {...register("name", { required: true })} placeholder="Product Name" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
          <input {...register("price", { required: true })} type="number" placeholder="Price" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
          <textarea {...register("description")} placeholder="Description" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
          <select {...register("category", { required: true })} className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
          <input {...register("sizes")} placeholder="Sizes (comma separated)" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
          <input {...register("quantity", { required: true })} type="number" placeholder="Total Quantity" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />

          <div>
            <label className="block font-semibold">How many color variants? (max 5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={colorCount}
              onChange={handleColorCountChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          {colorInputs.map((ci, index) => (
            <div key={index} className="border p-3 rounded mb-3">
              <input
                type="text"
                placeholder={`Color #${index + 1} name`}
                value={ci.color}
                onChange={(e) => handleColorNameChange(index, e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline mb-2"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleColorFileChange(index, e.target.files)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
              <label className="block mt-4">
                <span className="text-gray-700">Custom Tags (comma-separated)</span>
                <input
                  type="text"
                  {...register('customTags')}
                  placeholder="e.g. cotton, formal, summer wear"
                  className="mt-1 block w-full border p-2 rounded"
                />
              </label>
              {uploadedImages[ci.color]?.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {uploadedImages[ci.color].map((url, i) => (
                    <Image key={i} src={url} height={80} alt='image' width={80} className="border rounded" />
                  ))}
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
