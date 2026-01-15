import { Router } from "express";
import { getProductId } from "../modules/product/product.controller";

export const router = Router();

router.get("/:id", getProductId);