const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const {
  registerUser,
  loginUser,
  verifyDigilockerToken,
  sanitizeUser,
} = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data,
  });
});

const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data,
  });
});

const digilockerVerify = asyncHandler(async (req, res) => {
  const verification = await verifyDigilockerToken(req.body.authorizationToken);

  if (verification.verified) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { digilockerVerified: true },
    });
  }

  const freshUser = await prisma.user.findUnique({ where: { id: req.user.id } });

  res.status(200).json({
    success: true,
    message: verification.verified ? 'DigiLocker verification successful' : 'Verification failed',
    data: {
      verification,
      user: sanitizeUser(freshUser),
    },
  });
});

module.exports = {
  register,
  login,
  digilockerVerify,
};
