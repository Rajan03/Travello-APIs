const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/protectRoute');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/signin', authController.signinUser);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', protect, authController.updatePassword);

module.exports = router;
