"use client"

import { useState } from "react"
import Link from "next/link"
import { History, Trophy, XCircle, Clock, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type BidHistoryStatus = "won" | "lost" | "active"

type BidHistoryItem = {
  id: number
  auctionName: string
  auctionId: number
  yourBid: number
  winningBid: number | null
  status: BidHistoryStatus
  date: string
  creditsUsed: number
}

// Mock bid history data
const bidHistoryData: BidHistoryItem[] = [
  {
    id: 1,
    auctionName: "Vintage Rolex Submariner",
    auctionId: 1,
    yourBid: 4500,
    winningBid: 4500,
    status: "won",
    date: "2024-03-15",
    creditsUsed: 4500,
  },
  {
    id: 2,
    auctionName: "1967 Ford Mustang Model",
    auctionId: 2,
    yourBid: 1100,
    winningBid: 1250,
    status: "lost",
    date: "2024-03-14",
    creditsUsed: 0,
  },
  {
    id: 3,
    auctionName: "Antique Victorian Mirror",
    auctionId: 3,
    yourBid: 890,
    winningBid: null,
    status: "active",
    date: "2024-03-14",
    creditsUsed: 0,
  },
  {
    id: 4,
    auctionName: "Japanese Ceramic Vase",
    auctionId: 5,
    yourBid: 750,
    winningBid: 750,
    status: "won",
    date: "2024-03-13",
    creditsUsed: 750,
  },
  {
    id: 5,
    auctionName: "Rare First Edition Book",
    auctionId: 4,
    yourBid: 1800,
    winningBid: 2100,
    status: "lost",
    date: "2024-03-12",
    creditsUsed: 0,
  },
  {
    id: 6,
    auctionName: "Vintage Camera Collection",
    auctionId: 6,
    yourBid: 3200,
    winningBid: null,
    status: "active",
    date: "2024-03-12",
    creditsUsed: 0,
  },
  {
    id: 7,
    auctionName: "Art Deco Table Lamp",
    auctionId: 7,
    yourBid: 560,
    winningBid: 560,
    status: "won",
    date: "2024-03-11",
    creditsUsed: 560,
  },
  {
    id: 8,
    auctionName: "Signed Baseball Memorabilia",
    auctionId: 8,
    yourBid: 1200,
    winningBid: 1450,
    status: "lost",
    date: "2024-03-10",
    creditsUsed: 0,
  },
]

const statusConfig: Record<
  BidHistoryStatus,
  { label: string; icon: typeof Trophy; className: string }
> = {
  won: { label: "Won", icon: Trophy, className: "bg-accent/10 text-accent border-accent/30" },
  lost: { label: "Lost", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/30" },
  active: { label: "Active", icon: Clock, className: "bg-primary/10 text-primary border-primary/30" },
}

export default function BidHistoryPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = bidHistoryData.filter((bid) => {
    const matchesFilter = filter === "all" || bid.status === filter
    const matchesSearch = bid.auctionName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: bidHistoryData.length,
    won: bidHistoryData.filter((b) => b.status === "won").length,
    lost: bidHistoryData.filter((b) => b.status === "lost").length,
    active: bidHistoryData.filter((b) => b.status === "active").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          Bid History
        </h1>
        <p className="text-muted-foreground mt-1">Track all your auction bids and outcomes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Bids</p>
          </CardContent>
        </Card>
        <Card className="border-accent/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{stats.won}</p>
            <p className="text-sm text-muted-foreground">Won</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.lost}</p>
            <p className="text-sm text-muted-foreground">Lost</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bids</SelectItem>
                <SelectItem value="won">Won Auctions</SelectItem>
                <SelectItem value="lost">Lost Auctions</SelectItem>
                <SelectItem value="active">Active Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Auction</TableHead>
                  <TableHead className="text-right">Your Bid</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Winning Bid</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Credits Used</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((bid) => {
                  const StatusIcon = statusConfig[bid.status].icon
                  return (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/bidder/auction/${bid.auctionId}`}
                          className="hover:text-primary transition-colors"
                        >
                          {bid.auctionName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${bid.yourBid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        {bid.winningBid ? `$${bid.winningBid.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={`${statusConfig[bid.status].className} gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[bid.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {new Date(bid.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        {bid.creditsUsed > 0 ? (
                          <span className="text-destructive">-{bid.creditsUsed.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/bidder/auction/${bid.auctionId}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bids found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
