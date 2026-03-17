const buildFraudAssessment = ({
  sameIpUsers,
  rapidBidCount,
  incrementAmount,
  minimumIncrement,
  coordinatedPattern,
  selfOutbid,
}) => {
  let riskScore = 0;
  const reasons = [];

  if (sameIpUsers > 1) {
    riskScore += 20;
    reasons.push('same IP used by multiple accounts');
  }

  if (rapidBidCount >= 5) {
    riskScore += 25;
    reasons.push('excessive rapid bids detected from the same IP');
  }

  if (incrementAmount >= minimumIncrement * 10) {
    riskScore += 15;
    reasons.push('abnormal bid increment detected');
  }

  if (coordinatedPattern) {
    riskScore += 30;
    reasons.push('coordinated multi-account bidding pattern detected');
  }

  if (selfOutbid) {
    reasons.push('self-outbidding pattern detected');
  }

  return {
    riskScore: Math.min(riskScore, 100),
    reasons,
  };
};

module.exports = {
  buildFraudAssessment,
};
