import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true, ref: "Category" },
    imageUrl: { type: String, required: true },
    popularity_score: {
      type: Number,
      default:0,
      index: true},
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
