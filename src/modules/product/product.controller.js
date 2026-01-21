import { Product } from "./product.model.js";
import { POPULARITY_SCORE } from "../../constants/popularity_score.js";

import mongoose from "mongoose";

export const getProductId = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error("Invalid product id");
      error.status = 400;
      return next(error);
    }

    const doc = await Product.findById(id)

    if (!doc) {
      const error = new Error("Product not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a product";
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));

    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();

    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const [data, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
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

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { popularity_score: POPULARITY_SCORE.VIEW } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err)
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const doc = await Product.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    } = req.body;

    // validation
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name and price are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category: category ? category.toUpperCase() : "GENERAL", // ⭐ default ทาง logic
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductPopularity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (!type || !POPULARITY_SCORE[type]) {
      return res.status(400).json({
        success: false,
        message: "Invalid popularity type",
        allow: Object.keys(POPULARITY_SCORE),
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { popularity_score: POPULARITY_SCORE[type] } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        productId: product._id,
        popularity_score: product.popularity_score,
        increasedBy: POPULARITY_SCORE[type],
        type,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }
    
  try {
    const doc = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!doc) {
      const error = new Error("Product not found");
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPopularProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ popularity_score: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};