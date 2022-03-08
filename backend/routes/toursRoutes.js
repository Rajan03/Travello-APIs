const express = require('express');
const toursController = require('../controllers/toursController');
const reviewRouter = require('./reviewRoutes');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router();

// Nesting Routes
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(protect, toursController.getTours)
  .post(toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(
    protect,
    authorizedFor('admin', 'lead-guide'),
    toursController.deleteTourById
  );

module.exports = router;
