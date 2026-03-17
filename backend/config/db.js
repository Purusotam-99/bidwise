const prisma = require('./prisma');

const connectDB = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('Supabase Postgres connected');
  } catch (error) {
    error.message = `Postgres connection failed. Check DATABASE_URL in backend/.env and Supabase project connectivity. Original error: ${error.message}`;
    throw error;
  }
};

module.exports = connectDB;
