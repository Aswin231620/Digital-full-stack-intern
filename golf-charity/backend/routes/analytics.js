const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/analytics', verifyAdmin, getAnalytics);

module.exports = router;
