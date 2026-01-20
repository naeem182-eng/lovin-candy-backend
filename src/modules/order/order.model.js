import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
  user_id: { type: mongoose.Schema.Types.ObjectId , ref: "User" },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId , ref: "Product" },
      name: String,
      price: Number,
      quantity: { type: Number, required: true, min: 1 },

    }
  ],
  total_price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
},
  {
    timestamps: true,
  }
)

export const Order = mongoose.model("order", orderSchema)