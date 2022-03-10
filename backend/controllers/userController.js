const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlersFactory');

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
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

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

// @Todo: deleted user can update himself ?
// @Todo: Logging In user should activate user
