const ROLES = {
  ADMIN: 'admin',
  BIDDER: 'bidder',
};

const AUCTION_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
};

const CREDIT_TRANSACTION_TYPES = {
  ASSIGN: 'assign',
  RESERVE: 'reserve',
  REFUND: 'refund',
  DEDUCT: 'deduct',
};

const SOCKET_EVENTS = {
  JOIN_AUCTION_ROOM: 'joinAuctionRoom',
  BID_PLACED: 'bidPlaced',
  BID_UPDATE: 'bidUpdate',
  OUTBID_NOTIFICATION: 'outbidNotification',
  AUCTION_EXTENDED: 'auctionExtended',
  AUCTION_CLOSED: 'auctionClosed',
  FRAUD_ALERT: 'fraudAlert',
};

module.exports = {
  ROLES,
  AUCTION_STATUS,
  CREDIT_TRANSACTION_TYPES,
  SOCKET_EVENTS,
};
