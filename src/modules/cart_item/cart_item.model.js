import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity can not be less than 1."],
  },
  product_price: {
    type: Number,
    required: true,
  },
});

export const CartItem = mongoose.model("CartItem", cartItemSchema);