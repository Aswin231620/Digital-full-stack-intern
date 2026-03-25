const express = require('express');
const router = express.Router();
const { getCharities, addCharity, selectCharity, updateCharity, deleteCharity } = require('../controllers/charityController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.get('/', getCharities);
router.post('/', verifyAdmin, addCharity);
router.put('/:id', verifyAdmin, updateCharity);
router.delete('/:id', verifyAdmin, deleteCharity);
router.post('/select', verifyToken, selectCharity);

module.exports = router;
