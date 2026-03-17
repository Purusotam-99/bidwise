const AppError = require('../utils/appError');

const errorMiddleware = (error, _req, res, _next) => {
  const normalizedError =
    error instanceof AppError
      ? error
      : new AppError(error.message || 'Internal server error', error.statusCode || 500);

  if (normalizedError.statusCode >= 500) {
    console.error(normalizedError);
  }

  res.status(normalizedError.statusCode).json({
    success: false,
    message: normalizedError.message,
    details: normalizedError.details,
  });
};

module.exports = errorMiddleware;
