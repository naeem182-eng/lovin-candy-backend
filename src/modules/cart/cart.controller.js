import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";
import { POPULARITY_SCORE } from "../../constants/popularity_score.js";

export const updateCart = async (req, res, next) => {
  const { id } = req.params;

  const body = req.body;

  try {
    const update = await Cart.findOneAndUpdate(
      id, 
      body,
      { new: true }
    );

    if (!update) {
      const error = new Error("Item not found...");

      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: update,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id || null; // login → มีค่า / guest → null

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //  cart ของ user (หรือ guest = user:null)
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });

      //  update popularity เฉพาะตอน add ใหม่
      await Product.findByIdAndUpdate(productId, {
        $inc: { popularityScore: POPULARITY_SCORE.ADD_TO_CART },
      });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCartID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await Cart.findById(id);
    if (!doc) {
      const error = new Error("Cart not found");
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a cart";
    return next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json({
      success: true,
      data: carts,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const doc = await Cart.findByIdAndDelete(req.params.id);
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};