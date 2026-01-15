import { Product } from "./product.model.js";

export const getProductId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await Product.findById(id)
    if (!doc) {
      const error = new Error("Product not found");
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