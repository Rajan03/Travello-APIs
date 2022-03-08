const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

// POST - /api/v1/tours
// @desc - Creates a new tour
// Error code - t-101
exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// GET - /api/v1/tours
// @desc - gets all tours
// Error code - t-102
exports.getTours = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(Tour.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// PATCH - /api/v1/tours
// @desc - update tour
// Error code - t-103
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// GET - /api/v1/tours/:id
// @desc - get tour by id
// Error code - t-102
exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return new AppError('No tour with this id exists', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// DELETE - /api/v1/tours/:id
// @desc - delete tour by id
// Error code - t-102
exports.deleteTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return new AppError('No tour with this id exists', 404);
  }

  res.status(204).json({
    status: 'success',
  });
});

// @TODO: Implement error codes for debugging
// @TODO: Try out aggregate pipelines from mongo db
