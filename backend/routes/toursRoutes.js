const express = require('express');
const toursController = require('../controllers/toursController');
const { protect } = require('../middlewares/protectRoute');

const router = express.Router();

router
  .route('/')
  .get(protect, toursController.getTours)
  .post(toursController.createTour);

module.exports = router;
