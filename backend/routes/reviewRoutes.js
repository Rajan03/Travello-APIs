const express = require('express');
const reviewsController = require('../controllers/reviewController');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(authorizedFor('admin', 'lead-guide'), reviewsController.getReviews)
  .post(
    authorizedFor('user'),
    reviewsController.setTourIdAndUserId,
    reviewsController.createReview
  );

router
  .route('/:id')
  .delete(authorizedFor('admin', 'user'), reviewsController.deleteReview)
  .get(reviewsController.getOneReview)
  .patch(authorizedFor('user'), reviewsController.updateReview);

module.exports = router;
