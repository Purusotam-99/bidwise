const prisma = require('../config/prisma');
const { buildFraudAssessment } = require('../fraud/riskRules');

const detectCoordinatedPattern = (bids, currentUserId) => {
  const recentUserIds = bids.map((bid) => String(bid.userId));
  const uniqueUserIds = [...new Set(recentUserIds)];

  if (uniqueUserIds.length !== 2 || !recentUserIds.includes(String(currentUserId))) {
    return false;
  }

  let alternations = 0;
  for (let index = 1; index < recentUserIds.length; index += 1) {
    if (recentUserIds[index] !== recentUserIds[index - 1]) {
      alternations += 1;
    }
  }

  return alternations >= 4;
};

const evaluateBidRisk = async ({
  userId,
  auctionId,
  bidAmount,
  ipAddress,
  previousHighestBid,
  minimumIncrement,
  selfOutbid,
  tx,
}) => {
  const db = tx || prisma;
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  const [sameIpUsersGrouped, rapidBidCount, recentAuctionBids] = await Promise.all([
    db.bid.groupBy({
      by: ['userId'],
      where: { ipAddress },
    }),
    db.bid.count({
      where: {
        ipAddress,
        timestamp: { gte: oneMinuteAgo },
      },
    }),
    db.bid.findMany({
      where: { auctionId },
      orderBy: { timestamp: 'desc' },
      take: 6,
      select: { userId: true, timestamp: true },
    }),
  ]);

  const coordinatedPattern = detectCoordinatedPattern([...recentAuctionBids].reverse(), userId);
  const incrementAmount = previousHighestBid ? bidAmount - previousHighestBid : bidAmount;

  const assessment = buildFraudAssessment({
    sameIpUsers: sameIpUsersGrouped.length,
    rapidBidCount,
    incrementAmount,
    minimumIncrement,
    coordinatedPattern,
    selfOutbid,
  });

  await db.user.update({
    where: { id: userId },
    data: {
      fraudRiskScore: assessment.riskScore,
      isSuspicious: assessment.riskScore > 60,
    },
  });

  if (assessment.riskScore > 60) {
    const fraudLog = await db.fraudLog.create({
      data: {
        userId,
        auctionId,
        riskScore: assessment.riskScore,
        fraudReason: assessment.reasons.join(', '),
      },
    });

    assessment.alertPayload = {
      userId,
      auctionId,
      riskScore: assessment.riskScore,
      reasons: assessment.reasons,
      fraudLogId: fraudLog.id,
    };
  }

  return assessment;
};

module.exports = {
  evaluateBidRisk,
};
