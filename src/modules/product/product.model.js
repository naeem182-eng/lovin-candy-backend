import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    popularity_score: { type: Number, default:0},
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
