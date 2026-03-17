"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Clock,
  Gavel,
  ArrowLeft,
  TrendingUp,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getMockAuctionById, mockAuctions } from "@/lib/mock-auctions"
import {
  ensureBidderSession,
  getStoredBidderSession,
  refundBidCredits,
  reserveBidCredits,
  subscribeToBidderSessionUpdates,
} from "@/lib/mock-bidder-session"

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="text-center">
            <div className="bg-primary/10 rounded-lg px-4 py-2 min-w-[60px]">
              <span className="text-2xl font-bold text-primary">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
          </div>
          {index < 2 && <span className="text-2xl text-muted-foreground font-bold">:</span>}
        </div>
      ))}
    </div>
  )
}

export default function AuctionDetailsPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const auctionId = Number(params?.id)
  const defaultAuction = useMemo(
    () => getMockAuctionById(auctionId) ?? getMockAuctionById(mockAuctions[0].id)!,
    [auctionId]
  )
  const [auction, setAuction] = useState(defaultAuction)
  const [bidAmount, setBidAmount] = useState("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [hasBeenOutbid, setHasBeenOutbid] = useState(false)
  const [aiWarning, setAiWarning] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(100)

  useEffect(() => {
    const syncSession = () => {
      const session = getStoredBidderSession() ?? ensureBidderSession()
      setWalletBalance(session.walletBalance)
    }

    syncSession()
    return subscribeToBidderSessionUpdates(syncSession)
  }, [])

  useEffect(() => {
    setAuction(defaultAuction)
    setCurrentImageIndex(0)
    setBidAmount("")
    setHasBeenOutbid(false)
    setAiWarning(null)
  }, [defaultAuction])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const raw = window.localStorage.getItem("auctionOverrides")
      if (!raw) return

      const overrides = JSON.parse(raw) as Record<
        string,
        Partial<{ currentBid: number; totalBids: number }>
      >
      const override = overrides[String(defaultAuction.id)]

      if (override) {
        setAuction((prev) =>
          prev.id === defaultAuction.id
            ? {
                ...defaultAuction,
                currentBid: override.currentBid ?? defaultAuction.currentBid,
                totalBids: override.totalBids ?? defaultAuction.totalBids,
              }
            : prev
        )
      }
    } catch {
      // ignore storage errors
    }
  }, [defaultAuction])

  const minimumNextBid = useMemo(() => auction.currentBid + 100, [auction.currentBid])

  const recommendedBid = useMemo(() => {
    const timeLeftMs = auction.endTime.getTime() - Date.now()
    const hoursLeft = Math.max(timeLeftMs / (1000 * 60 * 60), 0)
    const urgencyMultiplier = hoursLeft < 0.5 ? 1.3 : hoursLeft < 2 ? 1.15 : 1.05
    const rounded = Math.round((minimumNextBid * urgencyMultiplier) / 50) * 50

    return Math.max(rounded, minimumNextBid)
  }, [auction.endTime, minimumNextBid])

  const persistAuctionOverride = (nextBid: number, nextTotalBids: number) => {
    if (typeof window === "undefined") return

    try {
      const raw = window.localStorage.getItem("auctionOverrides")
      const overrides = raw ? JSON.parse(raw) : {}
      overrides[String(auction.id)] = {
        currentBid: nextBid,
        totalBids: nextTotalBids,
      }
      window.localStorage.setItem("auctionOverrides", JSON.stringify(overrides))
    } catch {
      // ignore storage errors
    }
  }

  const handlePlaceBid = async () => {
    const numericBid = Number(bidAmount)

    if (!Number.isFinite(numericBid)) {
      alert("Please enter a valid bid amount")
      return
    }

    if (numericBid < minimumNextBid) {
      alert(`Minimum bid must be $${minimumNextBid}`)
      return
    }

    if (numericBid > walletBalance) {
      const shouldRedirectToWallet = window.confirm(
        `Your wallet balance is Rs ${walletBalance.toLocaleString()}, but this bid needs Rs ${numericBid.toLocaleString()}. Add credits now?`
      )

      if (shouldRedirectToWallet) {
        window.location.href = "/bidder/wallet"
      }
      return
    }

    if (numericBid > auction.currentBid * 1.5) {
      setAiWarning(
        "AI has detected an unusually large jump in bid amount. This could indicate shill bidding or price manipulation."
      )
    } else {
      setAiWarning(null)
    }

    setIsPlacingBid(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsPlacingBid(false)
    setBidAmount("")
    reserveBidCredits(auction.title, numericBid)

    setAuction((prev) => {
      const updated = {
        ...prev,
        currentBid: numericBid,
        totalBids: prev.totalBids + 1,
        bidHistory: [
          {
            id: Date.now(),
            bidder: "You",
            amount: numericBid,
            time: "Just now",
          },
          ...prev.bidHistory,
        ],
      }

      persistAuctionOverride(updated.currentBid, updated.totalBids)
      return updated
    })

    setHasBeenOutbid(false)

    setTimeout(() => {
      setAuction((prev) => {
        const competingBid = numericBid + 100
        const updated = {
          ...prev,
          currentBid: competingBid,
          totalBids: prev.totalBids + 1,
          bidHistory: [
            {
              id: Date.now(),
              bidder: "Smart bidder",
              amount: competingBid,
              time: "A few seconds ago",
            },
            ...prev.bidHistory,
          ],
        }

        persistAuctionOverride(updated.currentBid, updated.totalBids)
        return updated
      })
      setHasBeenOutbid(true)
      refundBidCredits(auction.title, numericBid)
    }, 8000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % auction.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + auction.images.length) % auction.images.length)
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="gap-2 -ml-2">
        <Link href="/bidder/dashboard">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img
              src={auction.images[currentImageIndex]}
              alt={auction.title}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.src = auction.image
              }}
            />
            <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground">
              {auction.category}
            </Badge>

            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex gap-2">
            {auction.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-1 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{auction.title}</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">{auction.description}</p>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Auction ends in</span>
              </div>
              <CountdownTimer endTime={auction.endTime} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Minimum Bid</p>
                <p className="text-xl font-bold">${auction.minimumBid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Current Highest Bid</p>
                <p className="text-xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                Place Your Bid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={minimumNextBid.toString()}
                    className="pl-7"
                    value={bidAmount}
                    onChange={(event) => setBidAmount(event.target.value.replace(/[^\d.]/g, ""))}
                  />
                </div>
                <Button onClick={handlePlaceBid} disabled={isPlacingBid || !bidAmount} className="px-6">
                  {isPlacingBid ? "Placing..." : "Place Bid"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Minimum next bid: ${minimumNextBid.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Wallet balance: Rs {walletBalance.toLocaleString()}</p>
              {aiWarning && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
                  {aiWarning}
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-3 space-y-1">
                <p className="font-medium text-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  AI suggested bid:
                  <span className="font-semibold text-primary">${recommendedBid.toLocaleString()}</span>
                </p>
                <p>
                  Based on current demand, time left, and minimum increment, this is a smart bid to stay competitive.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => setBidAmount(recommendedBid.toString())}
                >
                  Use AI suggested bid
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasBeenOutbid && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive text-sm">
              <Gavel className="w-4 h-4" />
              <span>You have been outbid. Try increasing your bid using the AI suggestion above.</span>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/30">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-medium">Verified Authentic Item</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Bid History</CardTitle>
            <Badge variant="secondary">{auction.totalBids} total bids</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auction.bidHistory.map((bid, index) => (
              <div key={`${bid.id}-${index}`}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {bid.bidder
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {bid.bidder}
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">Highest</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{bid.time}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${index === 0 ? "text-primary text-lg" : ""}`}>
                    ${bid.amount.toLocaleString()}
                  </p>
                </div>
                {index < auction.bidHistory.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
