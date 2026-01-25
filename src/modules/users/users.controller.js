import jwt from "jsonwebtoken";
import { User } from "./users.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, first_name, last_name, address, role } =
    req.body;

  try {
    const doc = await User.create({
      username,
      email,
      password,
      first_name,
      last_name,
      address,
      role,
    });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const createAddress = async (req, res, next) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "address is required",
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { address },
      { new: true }
    );

    if (!updateUser) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "Address created successfully",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

export const delAddress = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { address } = req.body;

  try {
    if (!address || typeof address !== "string") {
      return res.status(400).json({
        success: false,
        message: "address is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};



export const getAddress = async (req, res, next) => {
  try {
    const { userId } = req.params; // ดึงมาจากข้อมูล 1 คน?

    const addresses = await Delivery.find({ user_id: userId });
    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { address } = req.body;

  try {
    if (!address || typeof address !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: "Address data is required as an object" 
      });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { address: address },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

export const me = async (req, res, next) => {
  try {
    console.log("User Data from Middleware:", req.user);

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "No user information found in request (Check Middleware)",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// REGISTER
export const register = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newUser = await User.create({
      email,
      password,
      username: `user_${Math.floor(1000 + Math.random() * 9000)}`,
      role: "USER"
    });
    return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username
  }
});
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { username, first_name, last_name, email, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, first_name, last_name, email, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: "You can't delete your own account." });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
