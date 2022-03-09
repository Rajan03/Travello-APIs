const express = require('express');
const {
  updateMe,
  deleteMe,
  userDetails,
  allUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router();

router.route('/').get(protect, authorizedFor('admin'), allUsers);
router
  .route('/:id')
  .get(protect, userDetails)
  .delete(protect, authorizedFor('admin'), deleteUser)
  .patch(protect, authorizedFor('admin'), updateUser);

router.route('/me').patch(protect, updateMe).delete(protect, deleteMe);

module.exports = router;
