import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false 
  },
  name: String,
  imageUrl: String,
  isCustom: {
    type: Boolean,
    default: false
  },
  customDetails: {
    size: String,
    candies: [{
      candyId: String,
      name: String,
      quantity: Number
    }]
  },
  product_quantity: Number,
  price: Number,
});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);