const express = require('express');
const router = express.Router();
const { runDraw, getDraws } = require('../controllers/drawController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.post('/admin/run-draw', verifyAdmin, runDraw);
router.get('/draws', verifyToken, getDraws); // users can view past draws

module.exports = router;
