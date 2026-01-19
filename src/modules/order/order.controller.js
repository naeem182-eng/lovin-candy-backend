import { Order } from "./order.model";

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.find();
    return res.status(200).json({
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

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const validStatuses = ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"];
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return next(error);
  }
};
