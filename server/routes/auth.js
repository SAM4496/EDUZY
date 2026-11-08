const express = require('express');
const router = express.Router();
const { login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public
router.post('/login', login);

// Protected
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// NOTE: No register route - accounts created by Admin only via /api/users

module.exports = router;
