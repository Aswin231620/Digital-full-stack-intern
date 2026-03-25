const express = require('express');
const router = express.Router();
const { getAllUsers, getUserProfile, updateCharity, adminUpdateUser, adminDeleteUser } = require('../controllers/userController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile/charity', verifyToken, updateCharity);
router.get('/admin/users', verifyAdmin, getAllUsers);
router.put('/admin/users/:id', verifyAdmin, adminUpdateUser);
router.delete('/admin/users/:id', verifyAdmin, adminDeleteUser);

module.exports = router;
