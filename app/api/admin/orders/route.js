import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Orders from "@/models/Order";


export async function GET(){
    const session = await getServerSession(authOptions);

if(!session || session.user.role !== 'admin'){
    return new Response(JSON.stringify({error:"Unauthorised"}),{status:401});
}

await connectDB();

const orders = await Orders.find().lean();
return new Response(JSON.stringify(orders),{status:200});
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
    });

    await newOrder.save();

    return new Response(JSON.stringify({ success: true, order: newOrder }), {
      status: 200,
    });
  } catch (error) {
    // console.error("Order creation failed:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
