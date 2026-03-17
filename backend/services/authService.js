const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { ROLES } = require('../utils/constants');

const signToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  creditBalance: user.creditBalance,
  digilockerVerified: user.digilockerVerified,
  fraudRiskScore: user.fraudRiskScore,
  isSuspicious: user.isSuspicious,
  createdAt: user.createdAt,
});

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('A user with that email already exists', 409);
  }

  if (role === ROLES.ADMIN) {
    throw new AppError('Admin accounts must be provisioned separately', 403);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: ROLES.BIDDER,
    },
  });

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

const verifyDigilockerToken = async (authorizationToken) => {
  if (env.enableDigilockerMock) {
    return {
      verified: Boolean(authorizationToken),
      source: 'mock',
    };
  }

  if (!env.digilockerVerifyUrl) {
    throw new AppError('DigiLocker verification is not configured', 503);
  }

  const response = await fetch(env.digilockerVerifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationToken}`,
      'X-Client-Id': env.digilockerClientId,
      'X-Client-Secret': env.digilockerClientSecret,
    },
    body: JSON.stringify({ token: authorizationToken }),
  });

  if (!response.ok) {
    throw new AppError('DigiLocker verification failed', 502);
  }

  const data = await response.json();

  return {
    verified: Boolean(data.verified || data.success || data.data),
    source: 'digilocker',
    payload: data,
  };
};

module.exports = {
  signToken,
  sanitizeUser,
  registerUser,
  loginUser,
  verifyDigilockerToken,
};
