import Product from '@/models/Product'
import connectDB from '@/lib/mongodb'

export async function GET(req, { params }) {
  await connectDB()
  const { id } = params

  try {
    const product = await Product.findById(id)
    return new Response(JSON.stringify(product), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
  }
}
