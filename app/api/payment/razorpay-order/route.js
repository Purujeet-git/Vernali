import Razorpay from 'razorpay';

export async function POST(req) {
  const body = await req.json();
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Number(body.amount) * 100, // Amount in paise
    currency: "INR",
    receipt: "receipt_order_" + Date.now(),
  };

  const order = await instance.orders.create(options);
  return Response.json(order);
}
