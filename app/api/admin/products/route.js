// app/api/admin/products/route.js

import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      productName,
      description,
      price,
      category,
      quantity,
      sizes = [],
      colors = [],
      images = {},
      productSlug,
      lowStockThreshold = 5,
      customTags = [],
    } = body;

    if (!productName || !price || !category || !quantity || !productSlug) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // ✅ Generate tags from product details
    const generatedTags = [
      ...productName.split(' '),
      category,
      ...colors,
      ...sizes,
    ]
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag.length > 0);

    // ✅ Merge with custom tags
    const mergedTags = new Set([
      ...generatedTags,
      ...customTags.map((tag) => tag.toLowerCase().trim()),
    ]);

    const tags = Array.from(mergedTags);

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      quantity,
      sizes,
      colors,
      images,
      productSlug,
      lowStockThreshold,
      tags, // ✅ Save tags in schema
    });

    await newProduct.save();

    return NextResponse.json({ message: 'Product created successfully!' }, { status: 201 });
  } catch (err) {
    // console.error('Error saving product:', err);
    return NextResponse.json({ message: 'Internal server error', error: err.message }, { status: 500 });
  }
}
