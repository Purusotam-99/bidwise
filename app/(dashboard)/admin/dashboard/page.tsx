"use client"

import Link from "next/link"
import { 
  Package, 
  Users, 
  Gavel, 
  ShieldAlert, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign,
  Activity,
  BarChart3,
  UserCheck,
  Ban
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Admin-specific stats - platform overview
const adminStats = [
  { 
    title: "Total Auctions", 
    value: "156", 
    icon: Package, 
    change: "+12%",
    trend: "up",
    description: "Active & completed",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  { 
    title: "Active Bidders", 
    value: "2,847", 
    icon: Users, 
    change: "+18%",
    trend: "up",
    description: "Registered users",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  { 
    title: "Total Bids", 
    value: "12,459", 
    icon: Gavel, 
    change: "+24%",
    trend: "up",
    description: "This month",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10"
  },
  { 
    title: "Fraud Alerts", 
    value: "3", 
    icon: ShieldAlert, 
    change: "-40%",
    trend: "down",
    description: "Needs attention",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
]

// Revenue and platform metrics
const platformMetrics = {
  totalRevenue: "$248,500",
  avgBidValue: "$2,450",
  conversionRate: 68,
  userRetention: 84,
  platformGrowth: 42,
}

// Auction participation data for chart
const auctionParticipation = [
  { month: "Jan", auctions: 45, bids: 890, revenue: 28500 },
  { month: "Feb", auctions: 52, bids: 1120, revenue: 34200 },
  { month: "Mar", auctions: 48, bids: 980, revenue: 31800 },
  { month: "Apr", auctions: 61, bids: 1340, revenue: 42100 },
  { month: "May", auctions: 58, bids: 1250, revenue: 39600 },
  { month: "Jun", auctions: 72, bids: 1580, revenue: 52300 },
]

// Recent auctions for admin monitoring
const recentAuctions = [
  { id: 1, title: "Vintage Rolex Submariner", bids: 23, status: "active", endsIn: "2h 30m", revenue: 4500 },
  { id: 2, title: "1967 Ford Mustang Model", bids: 45, status: "active", endsIn: "5h 15m", revenue: 1200 },
  { id: 3, title: "Antique Victorian Mirror", bids: 12, status: "ending", endsIn: "15m", revenue: 890 },
  { id: 4, title: "Japanese Ceramic Vase", bids: 8, status: "active", endsIn: "8h 45m", revenue: 750 },
  { id: 5, title: "Rare First Edition Book", bids: 31, status: "completed", endsIn: "Ended", revenue: 2100 },
]

// Top performing bidders for admin review
const topBidders = [
  { id: 1, name: "Alex Mitchell", bids: 156, won: 34, winRate: 22, verified: true, riskLevel: "low" },
  { id: 2, name: "Sarah Kim", bids: 142, won: 28, winRate: 20, verified: true, riskLevel: "low" },
  { id: 3, name: "John Davis", bids: 128, won: 31, winRate: 24, verified: false, riskLevel: "medium" },
  { id: 4, name: "Emily Stone", bids: 115, won: 25, winRate: 22, verified: true, riskLevel: "low" },
  { id: 5, name: "Chris Park", bids: 98, won: 19, winRate: 19, verified: true, riskLevel: "high" },
]

// Fraud alerts for admin attention
const fraudAlerts = [
  { id: 1, user: "suspicious_user_01", type: "Multiple accounts", severity: "high", time: "10 mins ago" },
  { id: 2, user: "bidder_234", type: "Unusual bid pattern", severity: "medium", time: "1 hour ago" },
  { id: 3, user: "new_user_89", type: "Unverified high bids", severity: "low", time: "3 hours ago" },
]

export default function AdminDashboard() {
  const maxBids = Math.max(...auctionParticipation.map(d => d.bids))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management controls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/auctions">
              <Package className="w-4 h-4 mr-2" />
              Manage Auctions
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/fraud">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Fraud Center
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Link>
          </Button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.title} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={stat.trend === "up" ? "text-emerald-500" : "text-emerald-500"}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Platform Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Platform Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-emerald-500">{platformMetrics.totalRevenue}</p>
              <p className="text-sm text-muted-foreground mt-1">Total this month</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold">{platformMetrics.avgBidValue}</p>
                <p className="text-xs text-muted-foreground">Avg Winning Bid</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">18.4</p>
                <p className="text-xs text-muted-foreground">Avg Bids/Auction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Health Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm font-bold text-emerald-500">{platformMetrics.conversionRate}%</span>
                </div>
                <Progress value={platformMetrics.conversionRate} className="h-3" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">User Retention</span>
                  <span className="text-sm font-bold text-blue-500">{platformMetrics.userRetention}%</span>
                </div>
                <Progress value={platformMetrics.userRetention} className="h-3" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Platform Growth (YoY)</span>
                  <span className="text-sm font-bold text-violet-500">{platformMetrics.platformGrowth}%</span>
                </div>
                <Progress value={platformMetrics.platformGrowth} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auction Participation & Bid Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auction Participation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Auction Participation Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auctionParticipation.map((item) => (
                <div key={item.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground w-10">{item.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(item.bids / maxBids) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-medium w-20 text-right">{item.bids} bids</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Total Bids per Month</span>
              </div>
              <span className="font-medium">+24% growth</span>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Alerts Summary */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Active Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fraudAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    alert.severity === "high" 
                      ? "bg-destructive/10 border border-destructive/30" 
                      : alert.severity === "medium"
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === "high" 
                        ? "bg-destructive" 
                        : alert.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{alert.user}</p>
                      <p className="text-xs text-muted-foreground">{alert.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/fraud">
                View All Alerts
                <ShieldAlert className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Auctions & Top Bidders Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Auctions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Recent Auctions
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/auctions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentAuctions.map((auction) => (
                <div 
                  key={auction.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{auction.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{auction.bids} bids</span>
                      <span>-</span>
                      <span>${auction.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline"
                      className={
                        auction.status === "active" 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : auction.status === "ending"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {auction.status === "ending" && <Clock className="w-3 h-3 mr-1" />}
                      {auction.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {auction.endsIn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Bidders with Admin Controls */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Top Bidders
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bidders">Manage Users</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topBidders.map((bidder, index) => (
                <div 
                  key={bidder.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 
                        ? "bg-amber-500/20 text-amber-500" 
                        : index === 1 
                        ? "bg-muted text-muted-foreground"
                        : index === 2
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{bidder.name}</p>
                        {bidder.verified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{bidder.bids} bids - {bidder.winRate}% win rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        bidder.riskLevel === "low" 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : bidder.riskLevel === "medium"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {bidder.riskLevel}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <UserCheck className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
