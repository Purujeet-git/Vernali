import connectDB from "@/lib/mongodb";
import Visitors from "@/models/Visitors";
import { startOfDay,startOfWeek,startOfMonth } from "date-fns";

export async function GET() {
    await connectDB();

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now,{weekStartsOn:1});
    const monthStart = startOfMonth(now);

    try{
        const total = await Visitors.countDocuments();
        const today = await Visitors.countDocuments({createdAt:{$gte:todayStart}});
        const week = await Visitors.countDocuments({createdAt:{$gte:weekStart}});
        const month = await Visitors.countDocuments({createdAt:{$gte:monthStart}});


        return Response.json({success:true,data:{total,today,week,month}});
    }catch(error){
        // console.error("Failed to fetch visitor sales:",error);
        return Response.json({success:false},{status:500});
    }
}