const { SOCKET_EVENTS } = require('../utils/constants');

let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const emitToAuctionRoom = (auctionId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`auction:${auctionId}`).emit(event, payload);
  }
};

const emitToUser = (userId, event, payload) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, payload);
  }
};

const emitBidUpdate = (payload) => emitToAuctionRoom(payload.auctionId, SOCKET_EVENTS.BID_UPDATE, payload);
const emitBidPlaced = (payload) => emitToAuctionRoom(payload.auctionId, SOCKET_EVENTS.BID_PLACED, payload);
const emitAuctionExtended = (payload) =>
  emitToAuctionRoom(payload.auctionId, SOCKET_EVENTS.AUCTION_EXTENDED, payload);
const emitAuctionClosed = (payload) =>
  emitToAuctionRoom(payload.auctionId, SOCKET_EVENTS.AUCTION_CLOSED, payload);
const emitOutbidNotification = (userId, payload) =>
  emitToUser(userId, SOCKET_EVENTS.OUTBID_NOTIFICATION, payload);
const emitFraudAlert = (payload) => {
  if (ioInstance) {
    ioInstance.to('admins').emit(SOCKET_EVENTS.FRAUD_ALERT, payload);
  }
};

module.exports = {
  setIO,
  emitBidUpdate,
  emitBidPlaced,
  emitAuctionExtended,
  emitAuctionClosed,
  emitOutbidNotification,
  emitFraudAlert,
};
