// app/products/[slug]/page.jsx  (Server Component)
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAdmin } from '@/lib/isAdmin';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  await connectDB();

  const session = await getServerSession(authOptions);
  const isUserAdmin = session && await isAdmin(session.user.email);

  const product = await Product.findById(slug).lean();
  if (!product) return <div>Product not found</div>;

  let imagesByColor = {};

  if(product.images instanceof Map){
    imagesByColor = Object.fromEntries(product.images);

  }else if(typeof product.images === 'object' && product.images !== null ){
    imagesByColor = product.images;
  }
  
  const defaultColor = product.colors?.[0] || Object.keys(imagesByColor)[0];

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      isUserAdmin={isUserAdmin}
      imagesByColor = {imagesByColor}
      defaultColor={defaultColor} 
    />
  );
}
