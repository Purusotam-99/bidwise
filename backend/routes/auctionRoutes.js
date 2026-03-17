const express = require('express');
const { param } = require('express-validator');
const { getActiveAuctions, getAuctionDetails } = require('../controllers/auctionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getActiveAuctions);
router.get(
  '/:auctionId',
  [param('auctionId').isString().notEmpty().withMessage('Valid auctionId is required'), validateRequest],
  getAuctionDetails
);

module.exports = router;
