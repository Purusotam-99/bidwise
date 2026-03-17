const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const clientContextMiddleware = require('./middleware/clientContextMiddleware');
const registerAuctionSocket = require('./sockets/auctionSocket');
const { setIO } = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

setIO(io);
registerAuctionSocket(io);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clientContextMiddleware);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'BidWise backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(env.port, () => {
      console.log(`BidWise backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
