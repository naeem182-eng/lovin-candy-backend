import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },

    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: ["USER", "ADMIN","SUPER ADMIM", "VIEWER"], default: "USER" },
  }, {
    timestamps: true,
  })
  
export default mongoose.model("User", userSchema);