const express = require('express');
const {
  updateMe,
  deleteMe,
  userDetails,
  allUsers,
  deleteUser,
  updateUser,
  getMe,
} = require('../controllers/userController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router();
router.use(protect);

// /me routes
router.route('/me').get(getMe, userDetails).patch(updateMe).delete(deleteMe);

router.use(authorizedFor('admin'));

router.route('/').get(allUsers);
router.route('/:id').get(userDetails).delete(deleteUser).patch(updateUser);

module.exports = router;
