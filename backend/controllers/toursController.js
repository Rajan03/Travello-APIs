const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeature = require('../utils/apiFeatures');

// POST - /api/v1/tours
// @desc - Creates a new tour
// Error code - t-101
exports.createTour = catchAsync(async (req, res, next) => {});

// POST - /api/v1/tours
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

// POST - /api/v1/tours
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

// @TODO: Implement error codes for debugging
