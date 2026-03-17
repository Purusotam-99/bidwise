const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { AUCTION_STATUS, CREDIT_TRANSACTION_TYPES } = require('../utils/constants');
const { deductReservedCredits } = require('./creditService');
const { emitAuctionClosed } = require('../sockets/socketManager');

const listActiveAuctions = () =>
  prisma.auction.findMany({
    where: {
      status: AUCTION_STATUS.ACTIVE,
      startTime: { lte: new Date() },
      endTime: { gt: new Date() },
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { endTime: 'asc' },
  });

const getAuctionWithHistory = async (auctionId) => {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      highestBidder: { select: { id: true, name: true, email: true } },
    },
  });

  if (!auction) {
    throw new AppError('Auction not found', 404);
  }

  const bids = await prisma.bid.findMany({
    where: { auctionId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { timestamp: 'desc' },
  });

  const normalizedBids = bids.map((bid) => ({
    ...bid,
    userId: bid.user,
  }));

  return { auction, bids: normalizedBids };
};

const createAuction = async (payload) =>
  prisma.auction.create({
    data: {
      ...payload,
      startTime: new Date(payload.startTime),
      endTime: new Date(payload.endTime),
    },
  });

const closeAuction = async ({ auctionId }) => {
  const result = await prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({ where: { id: auctionId } });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    if (auction.status === AUCTION_STATUS.CLOSED) {
      throw new AppError('Auction is already closed', 400);
    }

    const updatedAuction = await tx.auction.update({
      where: { id: auctionId },
      data: {
        status: AUCTION_STATUS.CLOSED,
        endTime: new Date(),
      },
    });

    let winner = null;

    if (updatedAuction.highestBidderId && updatedAuction.currentHighestBid > 0) {
      await deductReservedCredits({
        userId: updatedAuction.highestBidderId,
        amount: updatedAuction.currentHighestBid,
        auctionId: updatedAuction.id,
        tx,
      });

      winner = await tx.user.findUnique({
        where: { id: updatedAuction.highestBidderId },
        select: { id: true, name: true, email: true },
      });
    }

    return {
      auction: updatedAuction,
      winner,
    };
  });

  emitAuctionClosed({
    auctionId: result.auction.id,
    finalBid: result.auction.currentHighestBid,
    winner: result.winner,
  });

  return result;
};

const getAnalytics = async () => {
  const [totalAuctions, totalBids, activeUsersGrouped, totalCreditsUsed] = await Promise.all([
    prisma.auction.count(),
    prisma.bid.count(),
    prisma.bid.groupBy({ by: ['userId'] }),
    prisma.creditTransaction.aggregate({
      where: { type: CREDIT_TRANSACTION_TYPES.DEDUCT },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalAuctions,
    totalBids,
    activeUsers: activeUsersGrouped.length,
    totalCreditsUsed: totalCreditsUsed._sum.amount || 0,
  };
};

module.exports = {
  listActiveAuctions,
  getAuctionWithHistory,
  createAuction,
  closeAuction,
  getAnalytics,
};
