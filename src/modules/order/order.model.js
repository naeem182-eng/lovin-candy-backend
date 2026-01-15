import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
  user_id: { type: mongoose.Schema.Types.ObjectId , ref: "User" },
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