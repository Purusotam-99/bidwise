const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  throw new Error(
    'Missing DATABASE_URL in backend/.env. Add your Supabase Postgres connection string before starting the server.'
  );
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  databaseUrl,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  enableBidLedger: process.env.ENABLE_BID_LEDGER === 'true',
  enableDigilockerMock: process.env.ENABLE_DIGILOCKER_MOCK === 'true',
  digilockerVerifyUrl: process.env.DIGILOCKER_VERIFY_URL || '',
  digilockerClientId: process.env.DIGILOCKER_CLIENT_ID || '',
  digilockerClientSecret: process.env.DIGILOCKER_CLIENT_SECRET || '',
};
