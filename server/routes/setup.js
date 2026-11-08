const express = require('express');
const router = express.Router();
const { getStatus, setupInstitute } = require('../controllers/setupController');

// Public routes - no auth needed
router.get('/status', getStatus);
router.post('/institute', setupInstitute);

module.exports = router;
