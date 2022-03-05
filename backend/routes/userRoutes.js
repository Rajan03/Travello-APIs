const express = require('express');
const { updateMe, deleteMe } = require('../controllers/userController');
const { protect } = require('../middlewares/protectRoute');

const router = express.Router();

router.patch('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);

module.exports = router;
