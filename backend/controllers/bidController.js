const asyncHandler = require('../utils/asyncHandler');
const { placeBid } = require('../services/bidService');

const placeBidController = asyncHandler(async (req, res) => {
  const result = await placeBid({
    auctionId: req.body.auctionId,
    bidderId: req.user.id,
    bidAmount: req.body.bidAmount,
    clientContext: req.clientContext,
  });

  res.status(201).json({
    success: true,
    message: 'Bid placed successfully',
    data: {
      auctionId: result.auction.id,
      bidId: result.bid.id,
      highestBid: result.auction.currentHighestBid,
      creditBalance: result.bidder.creditBalance,
      extendedUntil: result.extendedUntil,
      fraudAssessment: result.fraudAssessment,
      ledgerHash: result.ledgerEntry?.bidHash || null,
    },
  });
});

module.exports = {
  placeBidController,
};
