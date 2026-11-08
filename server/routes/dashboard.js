const express = require('express');
const router = express.Router();
const { adminStats, facultyStats, studentStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/admin', auth, roleGuard('admin'), adminStats);
router.get('/faculty', auth, roleGuard('faculty'), facultyStats);
router.get('/student', auth, roleGuard('student'), studentStats);

module.exports = router;
