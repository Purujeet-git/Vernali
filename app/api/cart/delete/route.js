import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await connectDB();

    const { productId } = await req.json();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Use productId and userEmail to find and delete the item
    const deletedItem = await Cart.findOneAndDelete({ _id: productId});
    // console.log("Deleting item with:", { productId, userEmail });

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    // console.error("Delete error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
