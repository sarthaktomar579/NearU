import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for scale (100k+ users)
// Unique compound index prevents duplicate concurrent friend requests
friendRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });
// Fast queries for incoming friend requests by recipient and status
friendRequestSchema.index({ recipient: 1, status: 1, createdAt: -1 });
// Fast queries for outgoing friend requests / accepted notifications by sender and status
friendRequestSchema.index({ sender: 1, status: 1, createdAt: -1 });


const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;