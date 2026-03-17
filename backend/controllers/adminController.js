const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { createAuction, closeAuction, getAnalytics } = require('../services/auctionService');
const { assignCredits } = require('../services/creditService');

const createAuctionController = asyncHandler(async (req, res) => {
  const auction = await createAuction({
    ...req.body,
    createdById: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Auction created successfully',
    data: auction,
  });
});

const assignCreditsController = asyncHandler(async (req, res) => {
  const user = await assignCredits({
    userId: req.body.userId,
    amount: req.body.amount,
  });

  res.status(200).json({
    success: true,
    message: 'Credits assigned successfully',
    data: {
      userId: user.id,
      creditBalance: user.creditBalance,
    },
  });
});

const listAllAuctions = asyncHandler(async (_req, res) => {
  const auctions = await prisma.auction.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      highestBidder: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: auctions,
  });
});

const listBiddersController = asyncHandler(async (_req, res) => {
  const bidders = await prisma.user.findMany({
    where: { role: 'bidder' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      creditBalance: true,
      digilockerVerified: true,
      fraudRiskScore: true,
      isSuspicious: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: bidders,
  });
});

const closeAuctionController = asyncHandler(async (req, res) => {
  const result = await closeAuction({
    auctionId: req.params.auctionId,
  });

  res.status(200).json({
    success: true,
    message: 'Auction closed successfully',
    data: result,
  });
});

const analyticsController = asyncHandler(async (_req, res) => {
  const analytics = await getAnalytics();

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

const fraudAlertsController = asyncHandler(async (_req, res) => {
  const alerts = await prisma.fraudLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          fraudRiskScore: true,
          isSuspicious: true,
        },
      },
      auction: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.status(200).json({
    success: true,
    data: alerts.map((entry) => ({
      ...entry,
      userId: entry.user,
      auctionId: entry.auction,
    })),
  });
});

const fraudUsersController = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { isSuspicious: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      fraudRiskScore: true,
      isSuspicious: true,
      digilockerVerified: true,
      creditBalance: true,
      createdAt: true,
    },
    orderBy: { fraudRiskScore: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: users,
  });
});

const fraudLogsController = asyncHandler(async (_req, res) => {
  const logs = await prisma.fraudLog.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, fraudRiskScore: true } },
      auction: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: logs.map((entry) => ({
      ...entry,
      userId: entry.user,
      auctionId: entry.auction,
    })),
  });
});

module.exports = {
  createAuctionController,
  assignCreditsController,
  listAllAuctions,
  listBiddersController,
  closeAuctionController,
  analyticsController,
  fraudAlertsController,
  fraudUsersController,
  fraudLogsController,
};
