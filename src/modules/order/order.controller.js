import { Order } from "./order.model.js";
import mongoose from "mongoose";
import { Product } from "../product/product.model.js";
import { POPULARITY_SCORE } from "../../constants/popularity_score.js";

export const createOrder = async (req, res, next) => {
  const { items, status } = req.body;

  const userIdFromToken = req.user.id;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required",
      });
    }

    const productIds = items.map((item) => item.product_id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let total_price = 0;
    const finalItems = [];

    for (const item of items) {
      const productInfo = dbProducts.find(
        (p) => p._id.toString() === item.product_id.toString(),
      );

      if (!productInfo) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Product ${item.product_id} not found`,
          });
      }

      if (productInfo.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `สินค้า ${productInfo.name} เหลือไม่พอ (คงเหลือ: ${productInfo.stock})`,
        });
      }

      total_price += productInfo.price * item.quantity;

      finalItems.push({
        product_id: productInfo._id,
        name: productInfo.name,
        price: productInfo.price,
        quantity: item.quantity,
      });

      await Product.findByIdAndUpdate(productInfo._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user_id: userIdFromToken,
      items: finalItems,
      total_price,
      status: status || "PENDING",
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (status === "DELIVERED") {
  for (const item of updatedOrder.items) {
    await Product.findByIdAndUpdate(item.product_id, {
      $inc: { popularity_score: POPULARITY_SCORE.ORDER_SUCCESS },
    });
    }
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await Order.findById(id);
    if (!doc) {
      const error = new Error("Order not found");
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get an order";
    return next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user_id: userId });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
