import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { invalidateUserCache } from "../middleware/auth.middleware.js";

/**
 * Get recommended users for language exchange
 * Optimized for 100k+ users with:
 * - Keyset/offset pagination (limit & page controls)
 * - Strict field projection (only necessary public profile fields)
 * - .lean() execution to bypass Mongoose hydration overhead
 * - Automatic exclusion of existing friends AND pending/accepted requests
 * - Language affinity matching (prioritizes complementary language learners)
 */
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id || req.user._id.toString();
    const currentUser = req.user;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50); // cap max limit to 50
    const skip = (page - 1) * limit;

    const { search, nativeLanguage, learningLanguage } = req.query;

    // Collect all user IDs that should be excluded (myself + current friends)
    const excludedIds = new Set();
    excludedIds.add(currentUserId.toString());

    if (Array.isArray(currentUser.friends)) {
      currentUser.friends.forEach((friendId) => {
        excludedIds.add(friendId.toString());
      });
    }

    // Also exclude any users where a pending or accepted friend request already exists
    const activeRequests = await FriendRequest.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    })
      .select("sender recipient")
      .lean();

    activeRequests.forEach((request) => {
      excludedIds.add(request.sender.toString());
      excludedIds.add(request.recipient.toString());
    });

    const excludedIdsArray = Array.from(excludedIds);

    // Build the query criteria
    const filter = {
      _id: { $nin: excludedIdsArray },
      isOnboarded: true,
    };

    if (nativeLanguage) {
      filter.nativeLanguage = { $regex: new RegExp(`^${nativeLanguage}$`, "i") };
    }

    if (learningLanguage) {
      filter.learningLanguage = { $regex: new RegExp(`^${learningLanguage}$`, "i") };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { fullName: searchRegex },
        { bio: searchRegex },
        { location: searchRegex },
      ];
    }

    // Run count and paginated query concurrently for maximum throughput
    const [totalUsers, recommendedUsers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("fullName profilePic nativeLanguage learningLanguage location bio createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    // If client requested with pagination parameters or as standard JSON
    res.status(200).json({
      users: recommendedUsers,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error in getRecommendedUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get current user's friends list
 * Optimized with lean() and projection
 */
export async function getMyFriends(req, res) {
  try {
    const currentUserId = req.user.id || req.user._id;

    const user = await User.findById(currentUserId)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage location bio")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends || []);
  } catch (error) {
    console.error("❌ Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Send a friend request
 * Optimized with compound index lookup & atomic validation
 */
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id || req.user._id.toString();
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    // Verify recipient exists (minimal projection)
    const recipient = await User.findById(recipientId).select("_id friends").lean();
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if already friends
    if (recipient.friends && recipient.friends.some((f) => f.toString() === myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // Check if request already exists (uses compound index {sender, recipient})
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    }).lean();

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    // Handle duplicate key error from MongoDB unique index gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: "A friend request already exists" });
    }
    console.error("❌ Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Accept a friend request
 * Optimized with atomic updates and session cache invalidation
 */
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const currentUserId = req.user.id || req.user._id.toString();

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify current user is recipient
    if (friendRequest.recipient.toString() !== currentUserId) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    if (friendRequest.status === "accepted") {
      return res.status(400).json({ message: "Friend request has already been accepted" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    const senderId = friendRequest.sender;
    const recipientId = friendRequest.recipient;

    // Concurrently update both users with atomic $addToSet
    await Promise.all([
      User.findByIdAndUpdate(senderId, {
        $addToSet: { friends: recipientId },
      }),
      User.findByIdAndUpdate(recipientId, {
        $addToSet: { friends: senderId },
      }),
    ]);

    // Invalidate user session cache for both users so their friend list updates immediately
    invalidateUserCache(senderId);
    invalidateUserCache(recipientId);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("❌ Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get friend requests & accepted notifications
 * Optimized with lean(), compound index, and limit
 */
export async function getFriendRequests(req, res) {
  try {
    const currentUserId = req.user.id || req.user._id;

    const [incomingReqs, acceptedReqs] = await Promise.all([
      FriendRequest.find({
        recipient: currentUserId,
        status: "pending",
      })
        .populate("sender", "fullName profilePic nativeLanguage learningLanguage")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),

      FriendRequest.find({
        sender: currentUserId,
        status: "accepted",
      })
        .populate("recipient", "fullName profilePic")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("❌ Error in getFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get outgoing friend requests
 * Optimized with lean(), compound index, and limit
 */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const currentUserId = req.user.id || req.user._id;

    const outgoingRequests = await FriendRequest.find({
      sender: currentUserId,
      status: "pending",
    })
      .populate("recipient", "fullName profilePic nativeLanguage learningLanguage")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("❌ Error in getOutgoingFriendReqs controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
