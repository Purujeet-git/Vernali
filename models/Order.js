import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items:[
    {
      productId:String,
      productName:String,
      quantity:Number,
      price:Number,
    },
  ],
  totalAmount:Number,
  name:String,
  email:String,
  phone:String,
  address:String,
  orderStatus:{
    type: String,
    default:'Processing',
  },
  deliveredAt:{
    type:Date,
    default:null,
  },
  userEmail:String,
  razorpayPaymentId:String,
  razorpayOrderId:String,
  razorpaySignature:String,
  paymentSuccess:Boolean,
  trackingNumber: {
    type: String,
    default: null,
  },
  courierSlug: {
    type: String,
    default: null,
  },
  trackingProvider:String,
},{timestamps:true});

export default mongoose.models?.Order || mongoose.model("Order",OrderSchema);