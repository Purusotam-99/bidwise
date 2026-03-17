const { emitFraudAlert } = require('../sockets/socketManager');

const notifyAdmins = (payload) => {
  emitFraudAlert(payload);
};

module.exports = {
  notifyAdmins,
};
