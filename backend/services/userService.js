const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { sanitizeUser } = require('./authService');
const { AUCTION_STATUS } = require('../utils/constants');

const getCurrentUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};

const getWalletSummary = async (userId) => {
  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.creditTransaction.findMany({
      where: { userId },
      include: {
        auction: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    user: sanitizeUser(user),
    transactions: transactions.map((entry) => ({
      ...entry,
      relatedAuction: entry.auction,
    })),
  };
};

const getBidHistory = async (userId) => {
  const bids = await prisma.bid.findMany({
    where: { userId },
    include: {
      auction: {
        select: {
          id: true,
          title: true,
          status: true,
          endTime: true,
          currentHighestBid: true,
          highestBidderId: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return bids.map((bid) => {
    const auction = bid.auction;
    const isClosed = auction?.status === AUCTION_STATUS.CLOSED;
    const isWinning = auction?.highestBidderId && String(auction.highestBidderId) === String(userId);

    let status = 'outbid';
    if (isClosed && isWinning) {
      status = 'won';
    } else if (!isClosed && isWinning) {
      status = 'leading';
    } else if (!isClosed) {
      status = 'active';
    }

    return {
      id: bid.id,
      auctionId: auction?.id || null,
      auctionTitle: auction?.title || 'Unknown auction',
      bidAmount: bid.bidAmount,
      timestamp: bid.timestamp,
      status,
      deviceFingerprint: bid.deviceFingerprint,
      ipAddress: bid.ipAddress,
      browserInfo: bid.browserInfo,
    };
  });
};

module.exports = {
  getCurrentUserProfile,
  getWalletSummary,
  getBidHistory,
};
