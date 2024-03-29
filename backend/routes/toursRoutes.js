const express = require('express');
const toursController = require('../controllers/toursController');
const reviewRouter = require('./reviewRoutes');
const { protect, authorizedFor } = require('../middlewares/protectRoute');

const router = express.Router();

// Nesting Routes
router.use('/:tourId/reviews', reviewRouter);

router.route('/distance/:latlng/unit/:unit').get(toursController.getDistances);

router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getTourWithin);

router
  .route('/')
  .get(toursController.getTours)
  .post(
    protect,
    authorizedFor('admin', 'lead-guide'),
    toursController.createTour
  );

router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(
    protect,
    authorizedFor('admin', 'lead-guide'),
    toursController.uploadTourImages,
    toursController.resizeTourImages,
    toursController.updateTour
  )
  .delete(
    protect,
    authorizedFor('admin', 'lead-guide'),
    toursController.deleteTourById
  );

module.exports = router;
