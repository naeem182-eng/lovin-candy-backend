import { Delivery } from "./delivery.model.js";
import mongoose from "mongoose";

export const getDeliveryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery id",
      });
    }

    const delivery = await Delivery.findById(id)
      .populate("order_id")
      .populate("user_id");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

export const getDeliveries = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));

    const status = (req.query.status || "").trim();
    const user_id = (req.query.user_id || "").trim();
    const order_id = (req.query.order_id || "").trim();

    const filter = {};
    if (status) filter.status = status;
    if (user_id && mongoose.isValidObjectId(user_id)) {
      filter.user_id = user_id;
    }
    if (order_id && mongoose.isValidObjectId(order_id)) {
      filter.order_id = order_id;
    }

    const [data, total] = await Promise.all([
      Delivery.find(filter)
        .populate("order_id")
        .populate("user_id")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Delivery.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const createDelivery = async (req, res, next) => {
  try {
    const {
      order_id,
      scheduled_date,
      user_id,
      status,
      shipped_at,
      postal_code,
    } = req.body;

    if (!order_id || !user_id || !shipped_at || !postal_code) {
      return res.status(400).json({
        success: false,
        message: "order_id, user_id, shipped_at, and postal_code are required",
      });
    }

    if (
      !mongoose.isValidObjectId(order_id) ||
      !mongoose.isValidObjectId(user_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order_id or user_id",
      });
    }

    const delivery = await Delivery.create({
      order_id,
      scheduled_date,
      user_id,
      status: status ?? "PENDING", //  default
      shipped_at,
      postal_code,
    });

    return res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery id",
      });
    }

    if (updateData.status) {
      const validStatuses = ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"];
      if (!validStatuses.includes(updateData.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
          allowedStatuses: validStatuses,
        });
      }
    }

    const delivery = await Delivery.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery id",
      });
    }

    const doc = await Delivery.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery id",
      });
    }

    const validStatuses = ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        allowedStatuses: validStatuses,
      });
    }

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        deliveryId: delivery._id,
        status: delivery.status,
      },
    });
  } catch (err) {
    next(err);
  }
};
