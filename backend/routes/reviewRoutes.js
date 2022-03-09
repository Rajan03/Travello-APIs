const express = require('express');
const reviewsController = require('../controllers/reviewController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    protect,
    authorizedFor('admin', 'lead-guide'),
    reviewsController.getReviews
  )
  .post(protect, authorizedFor('user'), reviewsController.createReview);

router
  .route('/:id')
  .delete(
    protect,
    authorizedFor('admin', 'user'),
    reviewsController.deleteReview
  )
  .patch(protect, authorizedFor('user'), reviewsController.updatReview);

module.exports = router;
