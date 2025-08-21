import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userEmail:{type:String,required:true},
  productId:{type:String,required:true},
  name:String,
  price:Number,
  image:String,
  quantity:{type:Number,default:1},
}, {
  timestamps: true
});

const Cart = mongoose.models?.cart || mongoose.model('cart', CartSchema);

export default Cart;