import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  payment_id: { type: mongoose.Schema.Types.ObjectId , ref: "Payment" },
  date: Date,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order"},
  total_amount: { type: Number, require: true },
  sub_total: { type: Number, require: true },
}, {
  timestamps: true,
})

export const Transaction = mongoose.model("Transaction", transactionSchema);