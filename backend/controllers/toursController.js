const Tour = require('../models/tourModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// POST - /api/v1/tours
// @desc - Creates a new tour
// Error code - t-101
exports.createTour = createOne(Tour);

// PATCH - /api/v1/tours
// @desc - update tour
// Error code - t-103
exports.updateTour = updateOne(Tour);

// DELETE - /api/v1/tours/:id
// @desc - delete tour by id
// Error code - t-102
exports.deleteTourById = deleteOne(Tour);

// GET - /api/v1/tours/:id
// @desc - get tour by id
// Error code - t-102
exports.getTourById = getOne(Tour, { path: 'reviews' });

// GET - /api/v1/tours
// @desc - gets all tours
// Error code - t-102
exports.getTours = getAll(Tour);

// @TODO: Implement error codes for debugging
// @TODO: Try out aggregate pipelines from mongo db
