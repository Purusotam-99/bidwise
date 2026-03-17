"use client"

import Link from "next/link"
import { Gavel, Clock, DollarSign, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const liveAuctions = [
  {
    id: 1,
    title: "Vintage Rolex Submariner 1969",
    category: "Watches",
    currentBid: 4500,
    endsIn: "2h 05m",
    bidders: 23,
    status: "Live",
  },
  {
    id: 2,
    title: "1967 Ford Mustang Model",
    category: "Collectibles",
    currentBid: 1200,
    endsIn: "4h 32m",
    bidders: 31,
    status: "Live",
  },
  {
    id: 3,
    title: "Antique Victorian Mirror",
    category: "Antiques",
    currentBid: 890,
    endsIn: "28m",
    bidders: 12,
    status: "Ending Soon",
  },
]

export default function BidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Gavel className="w-8 h-8 text-primary" />
          Bid Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter any live auction below and start bidding in real time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {liveAuctions.map((auction) => (
          <Card
            key={auction.id}
            className="overflow-hidden hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{auction.title}</CardTitle>
                  <CardDescription>{auction.category}</CardDescription>
                </div>
                <Badge
                  variant={auction.status === "Ending Soon" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {auction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Highest Bid</p>
                    <p className="text-xl font-bold text-primary">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{auction.bidders} bidders</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{auction.endsIn} left</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/bidder/auction/${auction.id}`} className="flex items-center justify-center gap-2">
                  Enter Auction &amp; Bid
                  <Gavel className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


