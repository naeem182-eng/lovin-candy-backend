import { CartItem } from "./cart_item.model.js";
import mongoose from "mongoose";

export const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cart item id" });
    }

    const doc = await CartItem.findByIdAndDelete(id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cart item deleted" });
  } catch (err) {
    next(err);
  }
};
