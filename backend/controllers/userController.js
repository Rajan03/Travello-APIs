const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = ([obj, ...allowedFields]) => {
  const newObj = {};

  obj.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// PATCH - /api/v1/user/me
// @desc - updates current logged in user data
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

  const user = await User.create(newUser);

  sendTokenResponse(user, 201, res);
});

// DELETE - /api/v1/user/me
// @desc - deactivates user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });

  const user = await User.create(newUser);

  sendTokenResponse(user, 201, res);
});
