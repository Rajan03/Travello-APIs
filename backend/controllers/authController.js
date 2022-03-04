const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendMail } = require('../utils/email');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get User with provided email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(404, 'No user with this email!!'));
  }

  // Generate random token
  const resetToken = user.genratePswResetToken();

  // Save the user with updated reset token
  await user.save({ validateBeforeSave: false });

  // Send token via Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password ? \n Click on the link below to update your password \n \n
  ${resetURL}. \n If ypu remember password please ignore this email`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Reset Password Token (Valif for 10 Min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Please check your email to update your password 😊',
    });
  } catch (error) {
    // If failed send error as well as reset token.
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    console.log(error);
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        500,
        'Something went wrong!! Failed to send Email! Please try again Later'
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user with token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  // Update password, If token is not expired and user exists
  if (!user) {
    return next(
      new AppError(
        400,
        'Invalid request or request timed out! Please try again!!'
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
  // Update changedPasswordAt property

  // Log In user Sign JWT
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});
