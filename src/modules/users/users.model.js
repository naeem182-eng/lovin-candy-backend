import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER ADMIN", "VIEWER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

/* ⭐ hash password ก่อน save */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
