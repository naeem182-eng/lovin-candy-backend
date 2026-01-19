import { Router } from "express";
import { createOrder } from "../modules/order/order.controller.js";

export const router = Router();

router.post("/", createOrder)