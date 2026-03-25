const express = require('express');
const router = express.Router();
const { addScore, getScores, updateScore, deleteScore } = require('../controllers/scoreController');
const { verifySubscribed, verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifySubscribed, addScore);
router.get('/', verifySubscribed, getScores);
router.put('/:id', verifyToken, updateScore); // verifyToken handles both user owner and admin
router.delete('/:id', verifyToken, deleteScore);

module.exports = router;
