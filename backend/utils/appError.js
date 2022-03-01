// Class can be used to create operational errors in API responses
// Like : Invlid id, Invalid path access, validation errors, timeouts etc.

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// Diffrence b/w this Class and global error middleware
// Class will create the error whereas middleware will catch those error and send proper
// formatted response to user.
