const AppError = require('../utils/appError');

const errorConstants = {
  devMode: 'development',
  prodMode: 'production',
  castError: 'CastError',
  duplicateError: 11000,
  validationError: 'ValidationError',
};

// Error during development
const sendDevError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// Error during production
const sendProdError = (res, error) => {
  // Three standard cases where error produced by mongoose are not operational.

  const sendError = (code, status, message) => {
    res.status(code).json({
      status: status,
      message: message,
    });
  };

  // CASE 1: Invalid Query param
  if (error.name === errorConstants.castError) {
    error = handleCastError(error);

    sendError(error.statusCode, error.status, error.message);
  }

  // CASE 2: Duplicate field error
  else if (error.code === errorConstants.duplicateError) {
    error = handleDuplicateError(error);

    sendError(error.statusCode, error.status, error.message);
  }

  // CASE 3: Fields Validation
  else if (error.name === errorConstants.validationError) {
    error = handleValidationError(error);

    sendError(error.statusCode, error.status, error.message);
  }

  // If no such case exists
  else {
    sendError(500, 'error', 'Something is very wrong !!');
  }
};

// Global error middleware function that can be called in express app by
// passing error as argument to next function in any controller or middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Error in Production mode is different from error in development mode.
  // Error in development mode.
  if (process.env.NODE_ENV === errorConstants.devMode) {
    sendDevError(res, err);
  }

  // Error in production mode.
  if (process.env.NODE_ENV === errorConstants.prodMode) {
    let error = { ...err };

    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      sendProdError(res, error);
    }
  }
};

// Helper functions
const handleCastError = (error) => {
  return new AppError(400, `Invalid ${error.path}: ${error.value}`);
};

const handleDuplicateError = (err) => {
  const keys = Object.keys(err.keyPattern).join(', ');

  return new AppError(
    400,
    `Duplicate value: ${keys}. Please use different value.`
  );
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);

  const errorMessage = `Ivalid data. ${errors.join('. ')}`;
  return new AppError(400, errorMessage);
};
