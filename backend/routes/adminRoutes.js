const express = require('express');
const { body, param } = require('express-validator');
const {
  createAuctionController,
  assignCreditsController,
  listAllAuctions,
  listBiddersController,
  closeAuctionController,
  analyticsController,
  fraudAlertsController,
  fraudUsersController,
  fraudLogsController,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authMiddleware, roleMiddleware(ROLES.ADMIN));

router.post(
  '/create-auction',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('imageURL').optional({ values: 'falsy' }).isURL().withMessage('imageURL must be a valid URL'),
    body('startingPrice').isFloat({ min: 0 }).withMessage('startingPrice must be positive'),
    body('minimumIncrement').isFloat({ min: 1 }).withMessage('minimumIncrement must be at least 1'),
    body('startTime').isISO8601().withMessage('startTime must be a valid ISO date'),
    body('endTime')
      .isISO8601()
      .withMessage('endTime must be a valid ISO date')
      .custom((value, { req }) => new Date(value) > new Date(req.body.startTime))
      .withMessage('endTime must be after startTime'),
    validateRequest,
  ],
  createAuctionController
);

router.post(
  '/assign-credits',
  [
    body('userId').isString().notEmpty().withMessage('Valid userId is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
    validateRequest,
  ],
  assignCreditsController
);

router.get('/auctions', listAllAuctions);
router.get('/bidders', listBiddersController);
router.get('/analytics', analyticsController);
router.get('/fraud-alerts', fraudAlertsController);
router.get('/fraud-users', fraudUsersController);
router.get('/fraud-logs', fraudLogsController);

router.post(
  '/close-auction/:auctionId',
  [param('auctionId').isString().notEmpty().withMessage('Valid auctionId is required'), validateRequest],
  closeAuctionController
);

module.exports = router;
