const clientContextMiddleware = (req, _res, next) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  req.clientContext = {
    ipAddress,
    deviceFingerprint: req.headers['x-device-fingerprint'] || 'unknown',
    browserInfo: req.headers['user-agent'] || 'unknown',
  };

  next();
};

module.exports = clientContextMiddleware;
