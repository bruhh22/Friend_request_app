const express = require("express");
const router = express.Router();
const {
  getUser,
  searchUsers,
  sendFriendRequest,
  handleFriendRequest,
  getFriendRecommendations,
} = require("../controllers/userController");
const {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

// User-related routes
router.get("/:id", getUser); // Get user details
router.get("/search/:username", searchUsers); // Search for users

// Friend-related routes
router.get("/friends", authMiddleware, getFriends); // Get user's friends
router.get("/requests", authMiddleware, getFriendRequests); // Get friend requests
router.post("/friend-request", authMiddleware, sendFriendRequest); // Send friend request
router.post(
  "/friend-request/:action",
  authMiddleware,
  handleFriendRequest
); // Accept or reject friend request (action = accept/reject)
router.patch(
  "/accept/:friendId",
  authMiddleware,
  acceptFriendRequest
); // Accept friend request
router.patch(
  "/reject/:friendId",
  authMiddleware,
  rejectFriendRequest
); // Reject friend request
router.get(
  "/recommendations",
  authMiddleware,
  getFriendRecommendations
); // Get friend recommendations

module.exports = router;
