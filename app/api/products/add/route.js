import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const imageFile = formData.get('image');

    if (!imageFile || typeof imageFile === 'string') {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Save image temporarily
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}-${imageFile.name}`;
    const tempPath = path.join('/tmp', filename);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: 'ecommerce-products',
    });

    await connectDB();

    const newProduct = await Product.create({
      name,
      price,
      description,
      image: result.secure_url,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    // console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}