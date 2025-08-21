import mongoose from "mongoose";

const staticImageSchema = new mongoose.Schema({
    key:{type:String, required:true},
    imageUrl:{type:String,required:true},
});

export default mongoose.model.HomeStaticImage || mongoose.model("HomeStaticImage",staticImageSchema);