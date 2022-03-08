const express = require('express');
const reviewsController = require('../controllers/reviewController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getReviews)
  .post(protect, authorizedFor('user'), reviewsController.createReview);

module.exports = router;
