const AppError = require('../utils/appError');

const roleMiddleware = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to access this resource', 403));
  }

  return next();
};

module.exports = roleMiddleware;
