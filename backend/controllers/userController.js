const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlersFactory');

// multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, imageDestination);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

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
// Field name 'photo' should match the user model key
exports.uploadImage = upload.single('photo');

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = ([obj, ...allowedFields]) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// GET - /api/v1/user/:id
// @desc - Get details about single user
exports.userDetails = getOne(User);

// GET - /api/v1/user
// @desc - Get all about single user
exports.allUsers = getAll(User);

// DELETE - /api/v1/user/:id
// @desc - deletes user account permanently by admin
exports.deleteUser = deleteOne(User);

// PATCH - /api/v1/user/:id
// @desc - updates any user document by its id by admin (Not for passwords)
exports.updateUser = updateOne(User);

//============= My routes (Logged In users) =================================

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// PATCH - /api/v1/user/me
// @desc - updates current logged in user data (Not for passwords)
exports.updateMe = catchAsync(async (req, res, next) => {
  // Error if password exists
  if (req.body.password || req.body.passwordComnfirm) {
    next(new AppError(400, 'Please use diffrent route for updating password.'));
  }

  // Remove unwanted fields that shouldn't be updated
  const filteredBody = filterObj([req.body, 'name', 'email']);
  if (req.file) filteredBody.photo = req.file.filename;

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// DELETE - /api/v1/user/me
// @desc - deactivates user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @TODO: deleted user can update himself ?
// @TODO: Logging In user should activate user
// @TODO: What if admin user isdeleting themsleves ?
