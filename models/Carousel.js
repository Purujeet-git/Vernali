import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  redirectUrl: {
    type: String,
    default: "/", // Set a default if not provided
  },
  carouselSection: {
    type: String,
    enum: ['main', 'productGrid', 'promotions', 'homePage', 'static1', 'static2', 'static3','static4','static5'],
    required: true,
    default: 'main',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Carousel || mongoose.model("Carousel", CarouselSchema);
