import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";
import { router as productRoutes } from "./product.routes.js";
import { router as cartRoutes } from "./cart.routes.js";
import { router as authRoutes } from "./auth.routes.js";
import { router as orderRoutes } from "./order.routes.js";

export const router = Router();

router.use("/users", usersRoutes);

router.use("/cart", cartRoutes);

router.use("/products", productRoutes);

router.use("/auth", authRoutes);

router.use("/orders", orderRoutes);
