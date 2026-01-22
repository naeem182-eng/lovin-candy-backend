import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
  user_id: { type: mongoose.Schema.Types.ObjectId , ref: "User" },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      imageUrl: String,
      quantity: { type: Number, required: true, min: 1 },
      isCustom: { type: Boolean, default: false },
      customDetails: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  total_price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "IN-TRANSIT", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    streetAddress: String,
    province: String,
    district: String,
    subDistrict: String,
    postalCode: String,
  },
},
  {
    timestamps: true,
  }
)

export const Order = mongoose.model("order", orderSchema)