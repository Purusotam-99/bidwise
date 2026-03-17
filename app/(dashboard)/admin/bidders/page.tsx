"use client"

import { useState } from "react"
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Ban,
  Coins,
  History,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type FraudRiskLevel = "low" | "medium" | "high"
type BidderStatus = "active" | "suspended"

type Bidder = {
  id: number
  name: string
  email: string
  avatar: string
  isVerified: boolean
  totalBids: number
  won: number
  winRate: number
  fraudRisk: FraudRiskLevel
  credits: number
  status: BidderStatus
  joinDate: string
}

// Mock bidder data
const biddersData: Bidder[] = [
  {
    id: 1,
    name: "Alex Mitchell",
    email: "alex.m@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 156,
    won: 34,
    winRate: 22,
    fraudRisk: "low",
    credits: 5240,
    status: "active",
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    name: "Sarah Kim",
    email: "sarah.k@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 142,
    won: 28,
    winRate: 20,
    fraudRisk: "low",
    credits: 3800,
    status: "active",
    joinDate: "2023-08-22",
  },
  {
    id: 3,
    name: "John Davis",
    email: "john.d@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 128,
    won: 31,
    winRate: 24,
    fraudRisk: "medium",
    credits: 2100,
    status: "active",
    joinDate: "2023-09-10",
  },
  {
    id: 4,
    name: "Emily Stone",
    email: "emily.s@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 115,
    won: 25,
    winRate: 22,
    fraudRisk: "low",
    credits: 4500,
    status: "active",
    joinDate: "2023-07-05",
  },
  {
    id: 5,
    name: "Chris Park",
    email: "chris.p@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 98,
    won: 19,
    winRate: 19,
    fraudRisk: "high",
    credits: 890,
    status: "suspended",
    joinDate: "2024-01-12",
  },
  {
    id: 6,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 87,
    won: 21,
    winRate: 24,
    fraudRisk: "low",
    credits: 3200,
    status: "active",
    joinDate: "2023-11-30",
  },
  {
    id: 7,
    name: "Ravi Kumar",
    email: "ravi.k@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 64,
    won: 18,
    winRate: 28,
    fraudRisk: "low",
    credits: 4100,
    status: "active",
    joinDate: "2023-10-01",
  },
  {
    id: 8,
    name: "Priya Singh",
    email: "priya.s@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 72,
    won: 20,
    winRate: 27,
    fraudRisk: "low",
    credits: 3600,
    status: "active",
    joinDate: "2023-09-18",
  },
  {
    id: 9,
    name: "Liam Johnson",
    email: "liam.j@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 54,
    won: 11,
    winRate: 20,
    fraudRisk: "medium",
    credits: 1900,
    status: "active",
    joinDate: "2024-01-05",
  },
  {
    id: 10,
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 102,
    won: 29,
    winRate: 28,
    fraudRisk: "low",
    credits: 5400,
    status: "active",
    joinDate: "2023-05-20",
  },
  {
    id: 11,
    name: "Noah Wilson",
    email: "noah.w@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 39,
    won: 6,
    winRate: 15,
    fraudRisk: "medium",
    credits: 1100,
    status: "active",
    joinDate: "2024-02-10",
  },
  {
    id: 12,
    name: "Ava Martinez",
    email: "ava.m@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 95,
    won: 24,
    winRate: 25,
    fraudRisk: "low",
    credits: 4700,
    status: "active",
    joinDate: "2023-08-02",
  },
  {
    id: 13,
    name: "Ethan Lee",
    email: "ethan.l@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 61,
    won: 10,
    winRate: 16,
    fraudRisk: "medium",
    credits: 1500,
    status: "active",
    joinDate: "2023-12-11",
  },
  {
    id: 14,
    name: "Isabella Rossi",
    email: "isabella.r@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 133,
    won: 32,
    winRate: 24,
    fraudRisk: "low",
    credits: 6200,
    status: "active",
    joinDate: "2023-04-08",
  },
  {
    id: 15,
    name: "Daniel Kim",
    email: "daniel.k@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 47,
    won: 7,
    winRate: 15,
    fraudRisk: "high",
    credits: 800,
    status: "suspended",
    joinDate: "2024-02-25",
  },
  {
    id: 16,
    name: "Sofia Petrova",
    email: "sofia.p@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 76,
    won: 19,
    winRate: 25,
    fraudRisk: "low",
    credits: 3900,
    status: "active",
    joinDate: "2023-07-28",
  },
  {
    id: 17,
    name: "Henry Clark",
    email: "henry.c@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 88,
    won: 22,
    winRate: 25,
    fraudRisk: "medium",
    credits: 3300,
    status: "active",
    joinDate: "2023-10-19",
  },
  {
    id: 18,
    name: "Mia Nguyen",
    email: "mia.n@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 59,
    won: 16,
    winRate: 27,
    fraudRisk: "low",
    credits: 2800,
    status: "active",
    joinDate: "2023-09-02",
  },
  {
    id: 19,
    name: "Jacob Harris",
    email: "jacob.h@example.com",
    avatar: "",
    isVerified: false,
    totalBids: 44,
    won: 9,
    winRate: 20,
    fraudRisk: "medium",
    credits: 1300,
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: 20,
    name: "Ella Thompson",
    email: "ella.t@example.com",
    avatar: "",
    isVerified: true,
    totalBids: 101,
    won: 27,
    winRate: 27,
    fraudRisk: "low",
    credits: 5100,
    status: "active",
    joinDate: "2023-06-01",
  },
]

const fraudRiskConfig: Record<FraudRiskLevel, { label: string; icon: typeof Shield; className: string }> = {
  low: { label: "Safe", icon: ShieldCheck, className: "bg-accent/10 text-accent border-accent/30" },
  medium: { label: "Medium", icon: Shield, className: "bg-warning/10 text-warning border-warning/30" },
  high: { label: "High Risk", icon: ShieldAlert, className: "bg-destructive/10 text-destructive border-destructive/30" },
}

export default function ManageBiddersPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBidder, setSelectedBidder] = useState<Bidder | null>(null)
  const [isCreditsOpen, setIsCreditsOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState("")

  const filteredBidders = biddersData.filter((bidder) => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "verified" && bidder.isVerified) ||
      (filter === "unverified" && !bidder.isVerified) ||
      (filter === "suspended" && bidder.status === "suspended") ||
      (filter === "high-risk" && bidder.fraudRisk === "high")
    const matchesSearch = 
      bidder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bidder.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleAssignCredits = () => {
    if (selectedBidder && creditAmount) {
      alert(`Assigned ${creditAmount} credits to ${selectedBidder.name}`)
      setIsCreditsOpen(false)
      setCreditAmount("")
      setSelectedBidder(null)
    }
  }

  const handleSuspendUser = (bidder: typeof biddersData[0]) => {
    alert(`${bidder.status === "suspended" ? "Activated" : "Suspended"} user: ${bidder.name}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Manage Bidders
        </h1>
        <p className="text-muted-foreground mt-1">View and manage registered bidders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{biddersData.length}</p>
            <p className="text-sm text-muted-foreground">Total Bidders</p>
          </CardContent>
        </Card>
        <Card className="border-accent/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {biddersData.filter(b => b.isVerified).length}
            </p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card className="border-warning/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">
              {biddersData.filter(b => b.fraudRisk === "medium" || b.fraudRisk === "high").length}
            </p>
            <p className="text-sm text-muted-foreground">At Risk</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {biddersData.filter(b => b.status === "suspended").length}
            </p>
            <p className="text-sm text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bidders</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="high-risk">High Risk</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Bidder</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Verified</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Win Rate</TableHead>
                  <TableHead className="text-center">Fraud Risk</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Credits</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBidders.map((bidder) => {
                  const FraudIcon = fraudRiskConfig[bidder.fraudRisk].icon
                  return (
                    <TableRow key={bidder.id} className={bidder.status === "suspended" ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={bidder.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {bidder.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {bidder.name}
                              {bidder.status === "suspended" && (
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                                  Suspended
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{bidder.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        {bidder.isVerified ? (
                          <CheckCircle className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <div>
                          <p className="font-medium">{bidder.winRate}%</p>
                          <p className="text-xs text-muted-foreground">{bidder.won}/{bidder.totalBids}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`${fraudRiskConfig[bidder.fraudRisk].className} gap-1`}>
                          <FraudIcon className="w-3 h-3" />
                          {fraudRiskConfig[bidder.fraudRisk].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium hidden lg:table-cell">
                        {bidder.credits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="w-4 h-4 mr-2" />
                              Bid History
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBidder(bidder)
                                setIsCreditsOpen(true)
                              }}
                            >
                              <Coins className="w-4 h-4 mr-2" />
                              Assign Credits
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className={bidder.status === "suspended" ? "text-accent" : "text-destructive"}
                              onClick={() => handleSuspendUser(bidder)}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              {bidder.status === "suspended" ? "Activate User" : "Suspend User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredBidders.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bidders found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Credits Dialog */}
      <Dialog open={isCreditsOpen} onOpenChange={setIsCreditsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Credits</DialogTitle>
            <DialogDescription>
              Add credits to {selectedBidder?.name}&apos;s account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedBidder?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedBidder?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current balance: {selectedBidder?.credits.toLocaleString()} credits
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit-amount">Credit Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditAmount(amount.toString())}
                  className={creditAmount === amount.toString() ? "border-primary" : ""}
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Button className="w-full" onClick={handleAssignCredits} disabled={!creditAmount}>
              <Coins className="w-4 h-4 mr-2" />
              Assign Credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
