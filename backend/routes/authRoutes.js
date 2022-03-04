const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/signin', authController.signinUser);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

// router.route('/')
// .get(authController)

module.exports = router;
