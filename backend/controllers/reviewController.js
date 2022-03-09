const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne } = require('./handlersFactory');

// GET - /api/v1/tours/:tourId/reviews
// @desc - gets all tours
// Error code - t-102
exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.body.tourId) {
    filter = { tour: req.body.tourId };
  }
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// POST - /api/v1/tours/:tourId/reviews
// @desc - Creates a new review
// Error code - r-101
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// DELETE - /api/v1/tours/:tourId/reviews/:id
// @desc - delete review by id
// Error code - t-102
exports.deleteReview = deleteOne(Review);

// PATCH - /api/v1/tours/:tourId/reviews/:id
// @desc - updates current logged in user data
exports.updatReview = updateOne(Review);
