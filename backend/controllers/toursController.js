const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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

exports.getTourWithin = catchAsync(async (req, res, next) => {
  // /tour-within/:distance/center/:latlng/unit/:unit
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'ml' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        400,
        'Please provide latitude and longitude as <lat,lng> format.'
      )
    );
  }

  const tours = await Tour.find({
    startsWith: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    message: 'success',
    data: {
      tours,
    },
  });
});
// @TODO: Implement error codes for debugging
// @TODO: Try out aggregate pipelines from mongo db
