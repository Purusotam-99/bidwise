"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Filter, Clock, DollarSign, Eye, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getMockAuctions } from "@/lib/mock-auctions"

const formatTimeLeft = (endTime: Date) => {
  const diff = endTime.getTime() - Date.now()

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const initialAuctions = getMockAuctions().map((auction) => ({
  id: auction.id,
  title: auction.title,
  category: auction.category,
  currentBid: auction.currentBid,
  timeLeft: formatTimeLeft(auction.endTime),
  bids: auction.totalBids,
  image: auction.image,
  status: auction.endTime.getTime() - Date.now() <= 60 * 60 * 1000 ? "Ending Soon" : "Active",
}))

export default function BrowseAuctionsPage() {
  const [auctionList, setAuctionList] = useState(initialAuctions)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const raw = window.localStorage.getItem("auctionOverrides")
      if (!raw) return

      const overrides = JSON.parse(raw) as Record<string, Partial<{ currentBid: number; totalBids: number }>>
      setAuctionList((prev) =>
        prev.map((auction) => {
          const override = overrides[String(auction.id)]

          return override
            ? {
                ...auction,
                currentBid: override.currentBid ?? auction.currentBid,
                bids: override.totalBids ?? auction.bids,
              }
            : auction
        })
      )
    } catch {
      // ignore storage errors
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Auctions</h1>
        <p className="text-muted-foreground mt-1">Discover and bid on unique items</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search auctions..." className="flex-1" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Auctions</h2>
          <Badge variant="secondary">{auctionList.length} items</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {auctionList.map((auction) => (
            <Card
              key={auction.id}
              className="overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {auction.title}
                    </CardTitle>
                    <CardDescription>{auction.category}</CardDescription>
                  </div>
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Current Bid</p>
                      <p className="text-xl font-bold">${auction.currentBid.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{auction.bids} bids</span>
                  </div>
                  <Badge
                    variant={auction.status === "Ending Soon" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {auction.status}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{auction.timeLeft} left</span>
                  </div>
                </div>

                <Button className="w-full" variant="default" asChild>
                  <Link href={`/bidder/auction/${auction.id}`} className="flex items-center justify-center gap-2">
                    Place Bid
                    <Gavel className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
