import { Order } from "./order.model.js"





export const createOrder = async(req, res, next) => {
    const { order_id, user_id,status} = req.body;

    try {

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }


    const order = await Order.create({
      user_id,
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

