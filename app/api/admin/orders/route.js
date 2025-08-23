import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Orders from "@/models/Order";
import { serializeMongoDoc } from "@/lib/serializeMongoDoc";

export async function GET(request) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: "Unauthorised" }), { status: 401 });
  }

  try {
    // Get status from query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    await connectDB();
    
    // Filter by status if provided, otherwise get all orders
    const query = status ? { orderStatus: status } : {};
    const ordersRaw = await Orders.find(query).lean();
    
    // Serialize the orders to handle MongoDB ObjectIds
    const orders = ordersRaw.map(serializeMongoDoc);
    
    return new Response(JSON.stringify(orders), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { 
      status: 500 
    });
  }
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Ensure items is always an array
    const items = Array.isArray(body.items) ? body.items : [body.items];

    const newOrder = new Orders({
      items: items,
      totalAmount: body.totalAmount,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      userEmail: body.userEmail,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpayOrderId: body.razorpayOrderId,
      razorpaySignature: body.razorpaySignature,
      paymentSuccess: body.paymentSuccess ?? false,
      orderStatus: 'Processing', // Set default status
    });

    await newOrder.save();

    return new Response(JSON.stringify({ success: true, order: newOrder }), {
      status: 200,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}