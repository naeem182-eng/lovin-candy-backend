import { Category } from "./category.model.js";

export const getCategories = async (req, res, next) => {
  try {
    const docs = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const doc = await Category.create(req.body);
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const doc = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const doc = await Category.findByIdAndDelete(req.params.id);
    if (!doc) 
      return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
