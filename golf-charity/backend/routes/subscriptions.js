const express = require('express');
const router = express.Router();
const { subscribe, getStatus, cancelSubscription } = require('../controllers/subscriptionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, subscribe);
router.get('/status', verifyToken, getStatus);
router.post('/cancel', verifyToken, cancelSubscription);

module.exports = router;
