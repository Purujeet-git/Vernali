import mongoose, { Mongoose } from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName:String,
    gender:String,
    email:{type:String, required:true,unique:true},
    password:{type:String},
    phone:String,
    picture: { type: String, default: "" },
    role: { 
        type: String, 
        enum: ["user", "admin"], // Ensures only these values can be assigned
        default: "user" // Sets "user" as the default role
    },
    adminNotes:{type:String,default:""},
    status:{type:String,enum:["active","disabled"],default:"active"},
},{timestamps:true});

export default mongoose.models.User || mongoose.model("User",UserSchema);