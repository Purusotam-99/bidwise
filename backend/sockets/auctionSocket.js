const { SOCKET_EVENTS } = require('../utils/constants');

const registerAuctionSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENTS.JOIN_AUCTION_ROOM, ({ auctionId, userId, role }) => {
      if (auctionId) {
        socket.join(`auction:${auctionId}`);
      }

      if (userId) {
        socket.join(`user:${userId}`);
      }

      if (role === 'admin') {
        socket.join('admins');
      }
    });

    socket.on('disconnect', () => {
      socket.removeAllListeners();
    });
  });
};

module.exports = registerAuctionSocket;
