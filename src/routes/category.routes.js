import express from "express";
import { createCategory, getCategory } from "../modules/category/category.controller.js";

const router = express.Router();

router.get("/", getCategory);
router.post("/", createCategory);

export default router;
