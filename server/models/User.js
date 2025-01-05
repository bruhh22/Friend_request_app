const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Friends field for relationships
      },
    ],
    friendRequestsSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequestsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profile: {
      bio: { type: String, default: "" },
      interests: [{ type: String }], // Optional for friend recommendations
    },
  },
  { timestamps: true }
);

// Export the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
