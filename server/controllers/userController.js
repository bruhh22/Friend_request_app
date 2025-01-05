// server/controllers/userController.js

const User = require("../models/User");

// Get user details
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("friends");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error getting user details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Search users by username
exports.searchUsers = async (req, res) => {
  const query = req.query.query || req.params.username; // Support both `query` and `username` as input
  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive partial match
    }).select("username");
    res.json(users);
  } catch (err) {
    console.error("Error searching for users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver)
      return res.status(404).json({ error: "Recipient not found" });

    if (receiver.friendRequestsReceived.includes(senderId))
      return res.status(400).json({ error: "Request already sent" });

    receiver.friendRequestsReceived.push(senderId);
    sender.friendRequestsSent.push(receiverId);

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Accept or reject a friend request
exports.handleFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  const { action } = req.params; // "accept" or "reject"

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ error: "User not found" });

    if (action === "accept") {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== friendId
    );
    friend.friendRequestsSent = friend.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await friend.save();

    res.json({ message: `Friend request ${action}ed` });
  } catch (err) {
    console.error(`Error handling friend request (${action}):`, err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get friend recommendations
exports.getFriendRecommendations = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("friends");
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendsOfFriends = await User.find({
      _id: { $nin: [id, ...user.friends] }, // Exclude the user and their friends
      friends: { $in: user.friends }, // Find users who are friends of the user's friends
    }).select("username");

    res.json(friendsOfFriends);
  } catch (err) {
    console.error("Error getting friend recommendations:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUser, 
  searchUsers, 
  sendFriendRequest,
  handleFriendRequest,
  getFriendRecommendations,
};
