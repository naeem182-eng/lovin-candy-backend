import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  product_quantity: Number,
  price: Number,
});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);