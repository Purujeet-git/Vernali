import OrdersList from "../OrdersList";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { serializeMongoDoc } from "@/lib/serializeMongoDoc";
import AdminSidebar from "../../admin_components/AdminSidebar";
import OrderPage from "../../admin_components/OrderPage";

export default async function ShippedOrdersPage() {
    await connectDB();
    const ordersRaw = await Order.find({orderStatus:"Shipped"}).lean();
    const orders = ordersRaw.map(serializeMongoDoc);


    return (
        <div className="p-10 text-black">
          <AdminSidebar />
      <h2 className="text-2xl font-bold mb-4">🚚 Shipped Orders</h2>
      <OrderPage status="Shipped"/>
      <OrdersList orders={orders} />

    </div>
    );
}