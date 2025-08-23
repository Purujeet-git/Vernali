import OrdersList from "../../admin_components/OrdersList";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { serializeMongoDoc } from "@/lib/serializeMongoDoc";
import OrderPage from "../../admin_components/OrderPage";
import AdminSidebar from "../../admin_components/AdminSidebar";

export default async function CompletedOrdersPage(){
    await connectDB();

    const ordersRaw = await Order.find({orderStatus:"delivered"}).lean();
    const orders = ordersRaw.map(serializeMongoDoc);

    return(
        <div className="p-10 text-black">
          <AdminSidebar />
      <h2 className="text-2xl font-bold mb-4">✅ Delivered Orders</h2>
      <OrderPage status="delivered"/>
      <OrdersList orders={orders} />
    </div>
    )
}