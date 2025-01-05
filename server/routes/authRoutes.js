const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// POST route for signing up
router.post('/signup', signup);

// POST route for logging in
router.post('/login', login);

module.exports = router;
