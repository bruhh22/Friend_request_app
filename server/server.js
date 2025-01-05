const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();  // Load environment variables from .env file

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-friend-search', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes setup
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/friends', authMiddleware, friendRoutes); // Protected friend routes (uses authMiddleware for JWT verification)

// Test route (to check if the server is working)
app.get('/api/test', (req, res) => {
  res.send({ message: 'Backend is working!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
