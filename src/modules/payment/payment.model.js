import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  type: { type: String },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  order_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: String,
  date: Date,
});

export const Payment = mongoose.model("Payment", paymentSchema);