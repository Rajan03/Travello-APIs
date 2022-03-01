const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// POST - /api/v1/auth/signup
// @desc - Creates a new user
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  const user = await User.create(newUser);

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

// POST - /api/v1/auth/signin
// @desc - Sign in existing user
exports.signinUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Email and password exists.
  if ((!email, !password)) {
    return next(new AppError(400, 'Please provide valid email and password'));
  }

  // 2. User exists in DB and password matches.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError(401, 'Incorrect Email or password'));
  }

  // 3. Sign token and send back.
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});
