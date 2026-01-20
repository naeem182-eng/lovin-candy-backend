import { Router } from "express";
import { createOrder, getOrderID, getOrders, getMyOrders, deleteOrder } from "../modules/order/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.post("/", auth, createOrder)

router.get("/", getOrders)

router.get("/my-orders", auth, getMyOrders);

router.get("/:id", getOrderID)

router.delete("/:id", auth, deleteOrder);
