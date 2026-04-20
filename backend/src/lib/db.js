import mongoose from "mongoose";

let cached = global._mongooseConnection;

export const connectDB = async () => {
  if (cached && cached.readyState === 1) {
    return cached;
  }

  if (mongoose.connection.readyState === 1) {
    cached = mongoose.connection;
    global._mongooseConnection = cached;
    return cached;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cached = conn.connection;
    global._mongooseConnection = cached;
    return conn;
  } catch (error) {
    console.error("Error in connecting to MongoDB", error);
    throw error;
  }
};