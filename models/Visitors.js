import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
    timestamp:{
        type:Date,
        default:Date.now,
    },
    page:String,
    userAgent:String,
    ip:String,
},{timestamps:true});

export default mongoose.models?.Visitor || mongoose.model("Visitor",VisitorSchema);