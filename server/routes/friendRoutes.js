const express = require('express');
const { 
  addFriend, 
  getFriends, 
  removeFriend, 
  unfriend, 
  getFriendRecommendations, 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest,
  getFriendRequestStatus
} = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

// Get the authenticated user's friends (protected)
router.get('/', authMiddleware, getFriends);

// Add a friend (protected)
router.post('/add', authMiddleware, addFriend);

// Remove a friend (protected)
router.delete('/remove', authMiddleware, removeFriend);

// Unfriend a user (protected)
router.delete('/:friendId', authMiddleware, unfriend);

// Get friend recommendations for a user (protected)
router.get('/recommendations/:userId', authMiddleware, getFriendRecommendations);

// Send a friend request (protected)
router.post('/request/:receiverId', authMiddleware, sendFriendRequest);

// Accept a friend request (protected)
router.patch('/accept/:friendId', authMiddleware, acceptFriendRequest);

// Reject a friend request (protected)
router.patch('/reject/:friendId', authMiddleware, rejectFriendRequest);

// Get the friend request status (protected)
router.get('/status/:userId/:friendId', authMiddleware, getFriendRequestStatus);

module.exports = router;
