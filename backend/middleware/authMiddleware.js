const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');

const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new AppError('User not found for this token', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.isOperational ? error : new AppError('Invalid or expired token', 401));
  }
};

module.exports = authMiddleware;
