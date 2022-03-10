const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// Middleware helper function to set tour and user id on request
exports.setTourIdAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// GET - /api/v1/tours/:tourId/reviews
// @desc - gets all reviews
// Error code - t-102
exports.getReviews = getAll(Review);

// GET - /api/v1/tours/:tourId/reviews/:id
// @desc - gets review by id
// Error code - t-102
exports.getOneReview = getOne(Review);

// POST - /api/v1/tours/:tourId/reviews
// @desc - Creates a new review
// Error code - r-101
exports.createReview = createOne(Review);

// DELETE - /api/v1/tours/:tourId/reviews/:id
// @desc - delete review by id
// Error code - t-102
exports.deleteReview = deleteOne(Review);

// PATCH - /api/v1/tours/:tourId/reviews/:id
// @desc - updates review
exports.updateReview = updateOne(Review);
