import { Router } from "express";
import { getProductId, getProducts, deleteProduct } from "../modules/product/product.controller.js";
import { createProduct } from "../modules/product/product.controller.js";

import {
  updateProductPopularity,
} from "../modules/product/product.controller.js";

export const router = Router();

router.get("/:id", getProductId);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);


router.get("/", getProducts);

// ไม่บังคับ auth
router.post("/", createProduct);
// บังคับ auth:
// router.post("/", auth, createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id/popular", updateProductPopularity);

