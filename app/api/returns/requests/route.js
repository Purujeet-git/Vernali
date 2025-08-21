import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const newRequest = await ReturnRequest.create({
      orderId: body.orderId,
      productId: body.productId,
      userEmail: body.userEmail,
      reason: body.reason,
      comment: body.comment,
      damaged: body.damaged,
      photoUrl: body.photoUrl,
    });

    return NextResponse.json({ message: 'Return request submitted', data: newRequest });
  } catch (err) {
    // console.error(err);
    return NextResponse.json({ error: 'Failed to submit return request' }, { status: 500 });
  }
}
