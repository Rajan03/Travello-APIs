const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check for token
  // 2) Verify token
  // 3) User still exists
  // 4) Password was changed after token signing
  console.log('Hello Protected Route');
  next();
});
