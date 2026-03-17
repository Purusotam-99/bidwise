"use client"

import { useMemo, useState } from "react"
import { TrendingUp, Zap, Target, AlertCircle, LineChart, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AIInsightsPage() {
  const [activePanel, setActivePanel] = useState<null | "predictions" | "bidding" | "trends" | "alerts" | "analytics" | "tips">(null)

  // Dummy but dynamic-style data so the section clearly "responds"
  const mockUserProfile = {
    name: "John",
    winRate: 49,
    favouriteCategories: ["Vintage Watches", "Collectibles"],
    usualBidWindow: "8–10 PM",
    avgBidSize: 1200,
  }

  const recommendedFocusCategory = useMemo(
    () => mockUserProfile.favouriteCategories[0],
    [mockUserProfile.favouriteCategories]
  )

  const smartNextBids = useMemo(
    () => [
      {
        title: "Vintage Rolex Submariner",
        suggested: 4800,
        probability: 72,
      },
      {
        title: "Classic Ferrari Model",
        suggested: 6200,
        probability: 65,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered recommendations to improve your bidding strategy</p>
      </div>

      {/* AI Recommendations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Price Prediction */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Price Prediction</CardTitle>
                <CardDescription>
                  Estimated final prices based on bidders like you
                </CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Vintage Rolex Submariner",
                  range: "$4,500 – $5,200",
                  note: "Similar watches you viewed last week",
                },
                {
                  title: "Classic Ferrari Model",
                  range: "$5,800 – $6,400",
                  note: "High interest, but within your usual spend",
                },
              ].map((item) => (
                <div key={item.title} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-lg font-bold text-primary">{item.range}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "predictions" ? null : "predictions")}
              >
                View All Predictions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Smart Bidding */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Smart Bidding</CardTitle>
                <CardDescription>
                  Suggested next bids for your watched auctions
                </CardDescription>
              </div>
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartNextBids.map((item) => (
                <div key={item.title} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-lg font-bold text-primary">
                    Next bid: ${item.suggested.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Win probability: {item.probability}%
                  </p>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "bidding" ? null : "bidding")}
              >
                Get Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Category Trends */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Category Trends</CardTitle>
                <CardDescription>Today&apos;s hot segments</CardDescription>
              </div>
              <LineChart className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{recommendedFocusCategory}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">↑ +12%</Badge>
                  <span className="text-xs text-muted-foreground">This week</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "trends" ? null : "trends")}
              >
                Explore Trends
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Alerts & Opportunities */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Opportunities & risks</CardDescription>
              </div>
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  High Competition Detected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Antique Persian Rug has 8 bidders
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "alerts" ? null : "alerts")}
              >
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Performance Analytics */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Your Performance</CardTitle>
                <CardDescription>Bidding statistics</CardDescription>
              </div>
              <Target className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-primary">32%</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Final Price</p>
                <p className="text-2xl font-bold text-primary">$1,850</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "analytics" ? null : "analytics")}
              >
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Personalized Tips */}
        <Card className="border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Tips & Advice</CardTitle>
                <CardDescription>Improve your strategy</CardDescription>
              </div>
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium mb-1">Pro Tip</p>
                <p className="text-muted-foreground">
                  Items ending between 8-10 PM have 15% less competition
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setActivePanel(activePanel === "tips" ? null : "tips")}
              >
                See More Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Insights / Active Panel Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activePanel === "predictions" && "All Price Predictions"}
            {activePanel === "bidding" && "Smart Bidding Recommendations"}
            {activePanel === "trends" && "Category Trend Analysis"}
            {activePanel === "alerts" && "Alerts & Risk Signals"}
            {activePanel === "analytics" && "Full Performance Analytics"}
            {activePanel === "tips" && "Strategy Tips & Playbook"}
            {!activePanel && "Recent AI Insights"}
          </CardTitle>
          <CardDescription>
            {!activePanel
              ? "Latest analysis and recommendations across your bidding activity."
              : "AI-generated details based on your recent auctions and bidding patterns."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activePanel && (
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">Collectibles Market Surge</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sports memorabilia prices increased by 18% over the last 7 days. Consider investing in this category.
                    </p>
                  </div>
                  <Badge variant="secondary">Hot</Badge>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">Your Bidding Pattern Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You tend to win more auctions on Wednesdays. Lower competition during weekday mornings.
                    </p>
                  </div>
                  <Badge variant="secondary">Personal</Badge>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">Price Drop Alert</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vintage watch prices have dropped 8% this week. Good time to increase your bids.
                    </p>
                  </div>
                  <Badge variant="secondary">Opportunity</Badge>
                </div>
              </div>
            </div>
          )}

          {activePanel === "predictions" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Based on the last 90 days of similar auctions, AI expects final prices in the following ranges. Use this
                to avoid overbidding.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vintage Rolex Submariner: most auctions closed between $4,500 and $5,400.</li>
                <li>Classic Ferrari Model collectibles: typical closing range is $5,900 to $6,500.</li>
                <li>Antique rugs in similar condition: 70% closed below $1,500.</li>
              </ul>
            </div>
          )}

          {activePanel === "bidding" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                AI suggests staggered bids instead of one large jump. This keeps you competitive while protecting credits.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Rolex: try $4,800 now, then $5,000 only if outbid in the last 15 minutes.</li>
                <li>Ferrari Model: start at $6,200 and cap at $6,500 as a hard limit.</li>
                <li>
                  Enable notifications so AI can prompt you only when the win probability is above 60% for the extra
                  credits you spend.
                </li>
              </ul>
            </div>
          )}

          {activePanel === "trends" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {recommendedFocusCategory} has been trending up this week with healthy demand but still reasonable win
                prices compared to peak months.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Average winning price is up 12% week‑over‑week.</li>
                <li>Number of active bidders per auction increased from 6.1 to 7.4.</li>
                <li>
                  Best value window: weekday evenings, where competition is lower but inventory is still strong.
                </li>
              </ul>
            </div>
          )}

          {activePanel === "alerts" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                AI is actively monitoring for unusual bidding spikes, self‑bidding patterns, and last‑second price
                pushes that look manipulative.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Antique Persian Rug: flagged for high competition and rapid back‑to‑back bids from 2 suspicious
                  accounts.
                </li>
                <li>
                  One bidder shows a pattern of raising prices aggressively and then not paying. Avoid chasing those
                  price jumps.
                </li>
                <li>
                  If AI shows a red warning on an auction, prefer allocating credits to safer items with similar value.
                </li>
              </ul>
            </div>
          )}

          {activePanel === "analytics" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Your last 30 days of bidding:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Win rate around {mockUserProfile.winRate}% across all categories.</li>
                <li>
                  Average bid size of ${mockUserProfile.avgBidSize.toLocaleString()} with best returns in{" "}
                  {mockUserProfile.favouriteCategories.join(", ")}.
                </li>
                <li>
                  You win most often when bidding in your usual window of {mockUserProfile.usualBidWindow}; AI suggests
                  focusing new bids there.
                </li>
              </ul>
            </div>
          )}

          {activePanel === "tips" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>AI playbook for safer and smarter bidding:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Set a max budget per auction and never cross it, even if outbid.</li>
                <li>Favor verified sellers and items with stable price histories.</li>
                <li>
                  When AI shows a fraud or manipulation warning, treat that auction as high risk and reduce your max bid
                  by 20–30%.
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
