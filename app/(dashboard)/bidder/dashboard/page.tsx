"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Wallet, 
  Clock, 
  Gavel, 
  ArrowRight,
  Flame,
  Eye,
  Bell
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMockAuctions } from "@/lib/mock-auctions"
import {
  ensureBidderSession,
  getStoredBidderSession,
  subscribeToBidderSessionUpdates,
} from "@/lib/mock-bidder-session"

const activeAuctions = getMockAuctions()

// Recent bid activity for the bidder
const recentBidActivity = [
  { id: 1, auction: "Vintage Rolex Submariner", amount: 4200, status: "outbid", time: "2 mins ago" },
  { id: 2, auction: "Antique Victorian Mirror", amount: 850, status: "winning", time: "15 mins ago" },
  { id: 3, auction: "Japanese Ceramic Vase", amount: 700, status: "winning", time: "1 hour ago" },
  { id: 4, auction: "1967 Ford Mustang Model", amount: 1100, status: "outbid", time: "3 hours ago" },
]

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft("Ended")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setIsUrgent(hours === 0 && minutes < 60)
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
      <Clock className="w-4 h-4" />
      {timeLeft}
      {isUrgent && <Flame className="w-4 h-4 text-destructive animate-pulse" />}
    </div>
  )
}

function AuctionCard({ auction }: { auction: typeof activeAuctions[0] }) {
  return (
    <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground">
          {auction.category}
        </Badge>
        {auction.isWatching && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
          {auction.totalBids} bids
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {auction.title}
          </h3>
          <CountdownTimer endTime={auction.endTime} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-lg font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/bidder/auction/${auction.id}`}>
              Place Bid
              <Gavel className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BidderDashboard() {
  const winRate = 49
  const [bidderName, setBidderName] = useState("Bidder")
  const [walletBalance, setWalletBalance] = useState(100)

  useEffect(() => {
    const syncSession = () => {
      const session = getStoredBidderSession() ?? ensureBidderSession()
      setBidderName(session.name.split(" ")[0] || "Bidder")
      setWalletBalance(session.walletBalance)
    }

    syncSession()
    return subscribeToBidderSessionUpdates(syncSession)
  }, [])

  const bidderStats = useMemo(
    () => [
      {
        title: "Auctions Participated",
        value: "47",
        icon: Target,
        change: "+5 this week",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        title: "Auctions Won",
        value: "23",
        icon: Trophy,
        change: "+3 this month",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
      },
      {
        title: "Winning Percentage",
        value: "49%",
        icon: TrendingUp,
        change: "Above average",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        title: "Credit Balance",
        value: `Rs ${walletBalance.toLocaleString()}`,
        icon: Wallet,
        change: "Available to bid",
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
      },
    ],
    [walletBalance]
  )

  return (
    <div className="space-y-8">
      {/* Header with personalized greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {bidderName}!</h1>
          <p className="text-muted-foreground mt-1">Here is your personal bidding overview and active auctions.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>
      </div>

      {/* Bidder Personal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bidderStats.map((stat) => (
          <Card key={stat.title} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Winning Progress and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circular Winning Percentage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Your Winning Percentage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted"
                    strokeWidth="10"
                    fill="none"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="stroke-emerald-500 transition-all duration-1000"
                    strokeWidth="10"
                    fill="none"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeLinecap="round"
                    strokeDasharray={`${winRate * 2.51} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{winRate}%</span>
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500">23</p>
                <p className="text-sm text-muted-foreground">Auctions Won</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Total Participated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bid Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              Your Recent Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBidActivity.map((bid) => (
                <div 
                  key={bid.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bid.auction}</p>
                    <p className="text-xs text-muted-foreground">{bid.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">${bid.amount.toLocaleString()}</p>
                    <Badge 
                      variant="outline"
                      className={
                        bid.status === "winning" 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {bid.status === "winning" ? "Winning" : "Outbid"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/bidder/history">
                View Full Bid History
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bid Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Bid Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-40 gap-2">
            {[
              { day: "Mon", bids: 5, won: 2 },
              { day: "Tue", bids: 8, won: 4 },
              { day: "Wed", bids: 3, won: 1 },
              { day: "Thu", bids: 6, won: 3 },
              { day: "Fri", bids: 10, won: 5 },
              { day: "Sat", bids: 7, won: 4 },
              { day: "Sun", bids: 4, won: 2 },
            ].map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <div 
                    className="w-full max-w-8 bg-primary/20 rounded-t-sm transition-all duration-500"
                    style={{ height: `${(item.bids / 10) * 100}px` }}
                  />
                  <div 
                    className="w-full max-w-8 bg-emerald-500 rounded-b-sm transition-all duration-500"
                    style={{ height: `${(item.won / 10) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/20" />
              <span className="text-muted-foreground">Total Bids</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-muted-foreground">Won</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Auctions Grid - Main feature for bidders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Active Auctions</h2>
            <p className="text-sm text-muted-foreground">Browse and place your bids on these items</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/bidder/browse">
              View All Auctions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  )
}
