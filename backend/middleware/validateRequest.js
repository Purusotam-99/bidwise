const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 422, errors.array()));
  }

  return next();
};

module.exports = validateRequest;
