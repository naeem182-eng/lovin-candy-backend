import { Router } from "express";
import { updateCart, addItemToCart, getCartID, getCart } from "../modules/cart/cart.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.patch("/:id", updateCart);

// guest
router.post("/items", addItemToCart);

// login
router.post("/items/me", auth, addItemToCart);

router.get("/", getCart);

router.get("/:id", getCartID);

