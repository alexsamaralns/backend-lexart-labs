const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const message = error.message;
  const stack = error.stack;

  console.log(error.name, error.message, stack);
  return res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const message = error.message;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  console.log(error.name, error.message);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    err =  new AppError('Invalid token', 400);
  }

  if (err.name === 'TokenExpiredError') {
    err =  new AppError('Token Expired', 400);
  }

  if (err.name === 'SequelizeValidationError') {
    err =  new AppError(err.errors[0].message, 400);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    err =  new AppError(err.errors[0].message, 400);
  }

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  sendErrorProd(err, res);
};

module.exports = globalErrorHandler;