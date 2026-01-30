import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri || !dbName) {
    throw new Error("Missing MongoDB environment variables");
  }

  try {
    await mongoose.connect(uri, { dbName });
    console.log(`MongoDB connected → ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
}
