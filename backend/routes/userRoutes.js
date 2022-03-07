const express = require('express');
const {
  updateMe,
  deleteMe,
  userDetails,
  allUsers,
} = require('../controllers/userController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router();

router.route('/').get(protect, authorizedFor('admin'), allUsers);
router.route('/:id').get(protect, userDetails);
router.route('/me').patch(protect, updateMe).delete(protect, deleteMe);

module.exports = router;
