const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { CREDIT_TRANSACTION_TYPES } = require('../utils/constants');

const getDb = (tx) => tx || prisma;

const createCreditTransaction = async ({ userId, amount, type, relatedAuction = null, tx }) =>
  getDb(tx).creditTransaction.create({
    data: {
      userId,
      amount,
      type,
      relatedAuction,
    },
  });

const assignCredits = async ({ userId, amount, tx = null }) => {
  const db = getDb(tx);
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { creditBalance: { increment: amount } },
  });

  await createCreditTransaction({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPES.ASSIGN,
    tx,
  });

  return updatedUser;
};

const reserveCredits = async ({ userId, amount, auctionId, tx }) => {
  const db = getDb(tx);
  const result = await db.user.updateMany({
    where: {
      id: userId,
      creditBalance: { gte: amount },
    },
    data: {
      creditBalance: { decrement: amount },
    },
  });

  if (!result.count) {
    throw new AppError('Insufficient credits available', 400);
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  await createCreditTransaction({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPES.RESERVE,
    relatedAuction: auctionId,
    tx,
  });

  return user;
};

const refundCredits = async ({ userId, amount, auctionId, tx }) => {
  const db = getDb(tx);
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      creditBalance: { increment: amount },
    },
  });

  await createCreditTransaction({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPES.REFUND,
    relatedAuction: auctionId,
    tx,
  });

  return updatedUser;
};

const deductReservedCredits = async ({ userId, amount, auctionId, tx }) =>
  createCreditTransaction({
    userId,
    amount,
    type: CREDIT_TRANSACTION_TYPES.DEDUCT,
    relatedAuction: auctionId,
    tx,
  });

module.exports = {
  assignCredits,
  reserveCredits,
  refundCredits,
  deductReservedCredits,
};
