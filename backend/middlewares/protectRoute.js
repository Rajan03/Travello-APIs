const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check for token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'Please login to continue!!'));
  }

  // 2) Verify token
  const verifiedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) User still exists
  const existingUser = await User.findById(verifiedData.id);

  if (!existingUser) {
    return next(
      new AppError(
        401,
        'User with email does not exists or might have changed password!!'
      )
    );
  }

  // 4) Password was changed after token signing
  if (existingUser.passwordChanged(verifiedData.iat)) {
    return next(
      new AppError(
        401,
        'User recently changed password! Please login again to continue!'
      )
    );
  }

  // 5) Set User to request
  req.user = existingUser;
  next();
});

// Trick to pass args to middlewares 😋
exports.authorizedFor = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(403, 'You have no permission to delete tour!!');
    }
    next();
  };
};
