const User = require('../models/User');

// Get the authenticated user's friends
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    res.status(200).json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
};

// Add a friend
const addFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    user.friends.push(friendId);
    await user.save();

    friend.friends.push(user._id);
    await friend.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add friend' });
  }
};

// Remove a friend
const removeFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    user.friends.pull(friendId);
    await user.save();

    friend.friends.pull(user._id);
    await friend.save();

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

// Unfriend a user
const unfriend = async (req, res) => {
  const { friendId } = req.params;

  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    user.friends.pull(friendId);
    await user.save();

    friend.friends.pull(user._id);
    await friend.save();

    res.status(200).json({ message: 'Unfriended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to unfriend' });
  }
};

// Get friend recommendations
const getFriendRecommendations = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    const friendsList = user.friends;

    const recommendations = await User.find({ 
      _id: { $nin: friendsList, $ne: userId } 
    }).limit(5); // Limiting the recommendations to 5

    res.status(200).json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get friend recommendations' });
  }
};

// Send a friend request
const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const user = await User.findById(req.userId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends or pending request
    if (user.friends.includes(receiverId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    if (user.sentRequests.includes(receiverId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    user.sentRequests.push(receiverId);
    await user.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send friend request' });
  }
};

// Accept a friend request
const acceptFriendRequest = async (req, res) => {
  const { friendId } = req.params;

  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (!user.sentRequests.includes(friendId)) {
      return res.status(400).json({ message: 'No request found to accept' });
    }

    user.friends.push(friendId);
    friend.friends.push(user._id);
    user.sentRequests.pull(friendId);
    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to accept friend request' });
  }
};

// Reject a friend request
const rejectFriendRequest = async (req, res) => {
  const { friendId } = req.params;

  try {
    const user = await User.findById(req.userId);

    if (!user.sentRequests.includes(friendId)) {
      return res.status(400).json({ message: 'No request found to reject' });
    }

    user.sentRequests.pull(friendId);
    await user.save();

    res.status(200).json({ message: 'Friend request rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject friend request' });
  }
};

// Get the status of a friend request
const getFriendRequestStatus = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user.sentRequests.includes(friendId)) {
      return res.status(200).json({ status: 'Pending' });
    }

    const friend = await User.findById(friendId);
    if (friend.sentRequests.includes(userId)) {
      return res.status(200).json({ status: 'Received' });
    }

    res.status(200).json({ status: 'Not connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get friend request status' });
  }
};

module.exports = {
  getFriends,
  addFriend,
  removeFriend,
  unfriend,
  getFriendRecommendations,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequestStatus
};
