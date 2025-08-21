import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req) {
    await connectDB();
    try{
        const orders = await Order.find({})
            .sort({createdAt:-1})
            .limit(10)
            .lean();

        return Response.json({
            success:true,
            data:orders,
        });
    }catch(error){
        // console.error("Error fetching latest orders:",err);
        return Response.json({success:false,message:"Failed to fetch orders"});
    }
}