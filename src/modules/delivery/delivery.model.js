import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Order",
  },
  scheduled_date: {
    type: Date,
    required: false,
    default: Date.now,
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  shipped_at: {
    type: String,
    required: true,
    trim: true,
  },
  postal_code: {
    type: String,
    required: true,
    match: [/^\d{5}(-\d{4})?$/, "Please fill a valid postal code"],
  },
});

export const Delivery = mongoose.model("Delivery", deliverySchema);