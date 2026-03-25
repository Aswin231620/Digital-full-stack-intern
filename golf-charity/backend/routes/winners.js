const express = require('express');
const router = express.Router();
const { uploadProof, verifyWinner, getWinners, getAllWinnersAdmin } = require('../controllers/winnerController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.post('/upload-proof', verifyToken, uploadProof);
router.get('/my-winnings', verifyToken, getWinners);

// Admin routes
router.put('/admin/verify-winner', verifyAdmin, verifyWinner);
router.get('/admin/winners', verifyAdmin, getAllWinnersAdmin);

module.exports = router;
