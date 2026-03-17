const asyncHandler = require('../utils/asyncHandler');
const {
  getCurrentUserProfile,
  getWalletSummary,
  getBidHistory,
} = require('../services/userService');

const getMeController = asyncHandler(async (req, res) => {
  const profile = await getCurrentUserProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

const getWalletController = asyncHandler(async (req, res) => {
  const wallet = await getWalletSummary(req.user.id);

  res.status(200).json({
    success: true,
    data: wallet,
  });
});

const getBidHistoryController = asyncHandler(async (req, res) => {
  const bids = await getBidHistory(req.user.id);

  res.status(200).json({
    success: true,
    data: bids,
  });
});

module.exports = {
  getMeController,
  getWalletController,
  getBidHistoryController,
};
