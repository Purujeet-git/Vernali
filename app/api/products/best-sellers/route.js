import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  try {
    const sales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.productId": { $ne: null }
        }
      },
      {
        $group: {
          _id: {
            $toObjectId: "$items.productId"
          },
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product._id",
          name: "$product.productName", // ✅ updated field
          price: "$product.price",
          // ✅ since `images` is a Map of arrays, grab the first available image
          image: {
            $let: {
              vars: {
                firstImagesArray: {
                  $arrayElemAt: [{ $objectToArray: "$product.images" }, 0] // get first entry of Map
                }
              },
              in: { $arrayElemAt: ["$$firstImagesArray.v", 0] } // get first image from that array
            }
          },
          totalSold: 1
        }
      }
    ]);

    return NextResponse.json(sales);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
