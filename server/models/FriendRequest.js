// server/models/FriendRequest.js
const mongoose = require('mongoose');

// Friend Request Schema
const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending' // Default status is 'pending'
  },
  sentAt: {
    type: Date,
    default: Date.now // Timestamp for when the request was sent
  }
});

// Create and export the model
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
