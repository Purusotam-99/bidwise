-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'bidder');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('active', 'closed');

-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('assign', 'reserve', 'refund', 'deduct');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'bidder',
    "creditBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "digilockerVerified" BOOLEAN NOT NULL DEFAULT false,
    "fraudRiskScore" INTEGER NOT NULL DEFAULT 0,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageURL" TEXT,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "currentHighestBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumIncrement" DOUBLE PRECISION NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "highestBidderId" TEXT,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bidAmount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceFingerprint" TEXT NOT NULL DEFAULT 'unknown',
    "ipAddress" TEXT NOT NULL DEFAULT 'unknown',
    "browserInfo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "relatedAuction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "fraudReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidLedger" (
    "id" TEXT NOT NULL,
    "bidHash" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Auction_status_startTime_endTime_idx" ON "Auction"("status", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Bid_auctionId_timestamp_idx" ON "Bid"("auctionId", "timestamp");

-- CreateIndex
CREATE INDEX "Bid_userId_timestamp_idx" ON "Bid"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "Bid_ipAddress_timestamp_idx" ON "Bid"("ipAddress", "timestamp");

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditTransaction_relatedAuction_idx" ON "CreditTransaction"("relatedAuction");

-- CreateIndex
CREATE INDEX "FraudLog_userId_createdAt_idx" ON "FraudLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "FraudLog_auctionId_createdAt_idx" ON "FraudLog"("auctionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BidLedger_bidHash_key" ON "BidLedger"("bidHash");

-- CreateIndex
CREATE INDEX "BidLedger_auctionId_timestamp_idx" ON "BidLedger"("auctionId", "timestamp");

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_highestBidderId_fkey" FOREIGN KEY ("highestBidderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_relatedAuction_fkey" FOREIGN KEY ("relatedAuction") REFERENCES "Auction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudLog" ADD CONSTRAINT "FraudLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudLog" ADD CONSTRAINT "FraudLog_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidLedger" ADD CONSTRAINT "BidLedger_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
