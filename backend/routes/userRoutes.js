const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMeController,
  getWalletController,
  getBidHistoryController,
} = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMeController);
router.get('/me/wallet', getWalletController);
router.get('/me/bids', getBidHistoryController);

module.exports = router;
