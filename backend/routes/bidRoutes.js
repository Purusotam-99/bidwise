const express = require('express');
const { body } = require('express-validator');
const { placeBidController } = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { bidRateLimiter } = require('../middleware/rateLimiter');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.post(
  '/place',
  authMiddleware,
  roleMiddleware(ROLES.BIDDER),
  bidRateLimiter,
  [
    body('auctionId').isString().notEmpty().withMessage('Valid auctionId is required'),
    body('bidAmount').isFloat({ min: 1 }).withMessage('bidAmount must be greater than 0'),
    validateRequest,
  ],
  placeBidController
);

module.exports = router;
