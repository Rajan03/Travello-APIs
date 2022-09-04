const multer = require('multer');
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

// Multer config - Storage
const multerStorage = multer.memoryStorage();

// Multer config - Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Not an image! Please upload only images.'), false);
  }
};

// Loaction to store the image
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// Field name 'imageCover and images' should match the user model key
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  console.log(req.files);

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

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

exports.getDistances = catchAsync(async (req, res, next) => {
  // /distance/:latlng/unit/:unit
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new AppError(
        400,
        'Please provide latitude and longitude as <lat,lng> format.'
      )
    );
  }

  // Note: If multiple fields with geospatial indexes,
  // then use keys parameterfor geoNear to identify on which field calculation is to be performed
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
      },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: {
      distances,
    },
  });
});

// @TODO: Implement error codes for debugging
// @TODO: Try out aggregate pipelines from mongo db
