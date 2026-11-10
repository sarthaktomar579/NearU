import mongoose from "mongoose";

// Connection cache across hot-reloads / serverless invocations
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || "50", 10), // Maintain up to 50 active socket connections
      minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || "10", 10), // Keep 10 idle sockets ready for instant response
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB cluster is unreachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Force IPv4 to avoid slow IPv6 DNS lookups
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((m) => {
      console.log(`✅ MongoDB Connected [Pool: ${opts.minPoolSize}-${opts.maxPoolSize}]: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise so subsequent requests can retry
    console.error("❌ Error connecting to MongoDB:", error.message);
    throw error;
  }
};

export default connectDB;
