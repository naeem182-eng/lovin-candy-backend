import jwt from "jsonwebtoken";
import { User } from "./users.model.js"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, first_name, last_name, address, role } = req.body;

  try {
    const doc = await User.create({ username, email, password, first_name, last_name, address, role });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const delAddress = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $unset: { address: "" } },
      { new: true }
    )

    if (!updateUser) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: updateUser
    })
  } catch (error) {
    next(error);
  }
}

export const updateAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { address } = req.body;

  try {
    const trimmed = String(address || "").trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, message: "address is required" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { address: trimmed },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

//  LOGIN
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    // สำคัญมาก: password ถูกซ่อน select:false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

