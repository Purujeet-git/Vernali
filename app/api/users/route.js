// app/api/users/route.js
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
  const { name, email } = await req.json();

  try {
    await connectToDatabase();
    const user = await User.create({ name, email });

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
