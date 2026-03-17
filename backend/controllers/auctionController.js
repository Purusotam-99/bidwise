const asyncHandler = require('../utils/asyncHandler');
const { listActiveAuctions, getAuctionWithHistory } = require('../services/auctionService');

const getActiveAuctions = asyncHandler(async (_req, res) => {
  const auctions = await listActiveAuctions();

  res.status(200).json({
    success: true,
    data: auctions,
  });
});

const getAuctionDetails = asyncHandler(async (req, res) => {
  const data = await getAuctionWithHistory(req.params.auctionId);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getActiveAuctions,
  getAuctionDetails,
};
