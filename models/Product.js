import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    images: {
        type: Map,
        of: [String],
    },
    colors: [String],
    sizes: [String],
    quantity: Number,
    lowStockThreshold: {
        type: Number,
        default: 5,
    },
    category: String,
    tags: {
        type: [String],
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models?.Product || mongoose.model("Product", ProductSchema);
