const crypto = require('crypto');
const prisma = require('../config/prisma');
const env = require('../config/env');

const createBidLedgerEntry = async ({ auctionId, userId, bidAmount, timestamp, tx }) => {
  if (!env.enableBidLedger) {
    return null;
  }

  const bidHash = crypto
    .createHash('sha256')
    .update(`${auctionId}${userId}${bidAmount}${timestamp.toISOString()}`)
    .digest('hex');

  return (tx || prisma).bidLedger.create({
    data: {
      bidHash,
      auctionId,
      timestamp,
    },
  });
};

module.exports = {
  createBidLedgerEntry,
};
