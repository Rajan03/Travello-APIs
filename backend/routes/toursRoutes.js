const express = require('express');
const toursController = require('../controllers/toursController');

const router = express.Router();

router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.createTour);

module.exports = router;
