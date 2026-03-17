const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { AUCTION_STATUS } = require('../utils/constants');
const { reserveCredits, refundCredits } = require('./creditService');
const { createBidLedgerEntry } = require('./ledgerService');
const { evaluateBidRisk } = require('./fraudDetectionService');
const { notifyAdmins } = require('../fraud/adminNotifier');
const {
  emitBidUpdate,
  emitAuctionExtended,
  emitBidPlaced,
  emitOutbidNotification,
} = require('../sockets/socketManager');

const placeBid = async ({ auctionId, bidderId, bidAmount, clientContext }) => {
  const result = await prisma.$transaction(async (tx) => {
    const [auction, bidder] = await Promise.all([
      tx.auction.findUnique({ where: { id: auctionId } }),
      tx.user.findUnique({ where: { id: bidderId } }),
    ]);

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    if (!bidder) {
      throw new AppError('Bidder not found', 404);
    }

    if (!bidder.digilockerVerified) {
      throw new AppError('DigiLocker verification is required before bidding', 403);
    }

    const now = new Date();

    if (auction.status !== AUCTION_STATUS.ACTIVE || auction.startTime > now || auction.endTime <= now) {
      throw new AppError('Auction is not active', 400);
    }

    const minimumAllowedBid =
      auction.currentHighestBid > 0
        ? auction.currentHighestBid + auction.minimumIncrement
        : auction.startingPrice;

    if (bidAmount < minimumAllowedBid) {
      throw new AppError(`Minimum allowed bid is ${minimumAllowedBid}`, 400);
    }

    const previousHighestBid = auction.currentHighestBid;
    const previousHighestBidderId = auction.highestBidderId || null;
    const isSelfOutbid = previousHighestBidderId === bidder.id;
    const availableCredits = bidder.creditBalance + (isSelfOutbid ? previousHighestBid : 0);

    if (availableCredits < bidAmount) {
      throw new AppError('Not enough credits to place this bid', 400);
    }

    if (previousHighestBidderId) {
      await refundCredits({
        userId: previousHighestBidderId,
        amount: previousHighestBid,
        auctionId: auction.id,
        tx,
      });
    }

    await reserveCredits({
      userId: bidder.id,
      amount: bidAmount,
      auctionId: auction.id,
      tx,
    });

    const remainingSeconds = Math.floor((auction.endTime.getTime() - now.getTime()) / 1000);
    let extendedUntil = null;
    let nextEndTime = auction.endTime;

    if (remainingSeconds <= 10) {
      nextEndTime = new Date(auction.endTime.getTime() + 30 * 1000);
      extendedUntil = nextEndTime;
    }

    const updatedAuction = await tx.auction.update({
      where: { id: auction.id },
      data: {
        currentHighestBid: bidAmount,
        highestBidderId: bidder.id,
        endTime: nextEndTime,
      },
    });

    const bid = await tx.bid.create({
      data: {
        auctionId: auction.id,
        userId: bidder.id,
        bidAmount,
        timestamp: now,
        deviceFingerprint: clientContext.deviceFingerprint,
        ipAddress: clientContext.ipAddress,
        browserInfo: clientContext.browserInfo,
      },
    });

    const ledgerEntry = await createBidLedgerEntry({
      auctionId: auction.id,
      userId: bidder.id,
      bidAmount,
      timestamp: now,
      tx,
    });

    const fraudAssessment = await evaluateBidRisk({
      userId: bidder.id,
      auctionId: auction.id,
      bidAmount,
      ipAddress: clientContext.ipAddress,
      previousHighestBid,
      minimumIncrement: auction.minimumIncrement,
      selfOutbid: isSelfOutbid,
      tx,
    });

    const updatedBidder = await tx.user.findUnique({ where: { id: bidder.id } });

    return {
      auction: updatedAuction,
      bid,
      bidder: updatedBidder,
      extendedUntil,
      previousHighestBidderId,
      previousHighestBid,
      ledgerEntry,
      fraudAssessment,
    };
  });

  emitBidUpdate({
    auctionId: result.auction.id,
    highestBid: result.auction.currentHighestBid,
    highestBidder: result.bidder.id,
    endTime: result.auction.endTime,
  });

  emitBidPlaced({
    auctionId: result.auction.id,
    bidId: result.bid.id,
    userId: result.bidder.id,
    bidAmount: result.bid.bidAmount,
    riskScore: result.fraudAssessment.riskScore,
  });

  if (result.previousHighestBidderId && result.previousHighestBidderId !== result.bidder.id) {
    emitOutbidNotification(result.previousHighestBidderId, {
      auctionId: result.auction.id,
      byBidder: {
        id: result.bidder.id,
        name: result.bidder.name,
      },
      previousBidAmount: result.previousHighestBid,
      newHighestBid: result.auction.currentHighestBid,
    });
  }

  if (result.extendedUntil) {
    emitAuctionExtended({
      auctionId: result.auction.id,
      endTime: result.extendedUntil,
    });
  }

  if (result.fraudAssessment.alertPayload) {
    notifyAdmins(result.fraudAssessment.alertPayload);
  }

  return result;
};

module.exports = {
  placeBid,
};
