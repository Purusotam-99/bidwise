"use client"

import { useState } from "react"
import { 
  ShieldAlert, 
  AlertTriangle,
  Users,
  Ban,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  UserX,
  DollarSign,
  Search,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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

type RiskLevel = "high" | "medium" | "low"
type FraudStatus = "flagged" | "under_review" | "cleared"

type SuspiciousUser = {
  id: number
  name: string
  email: string
  avatar: string
  fraudScore: number
  riskLevel: RiskLevel
  totalBids: number
  flags: { type: string; severity: "high" | "medium" | "low" }[]
  unpaidWins: number
  multipleAccounts: number
  lastActivity: string
  joinDate: string
  status: FraudStatus
}

// Mock suspicious users data
const suspiciousUsers: SuspiciousUser[] = [
  {
    id: 1,
    name: "Chris Park",
    email: "chris.p@example.com",
    avatar: "",
    fraudScore: 87,
    riskLevel: "high",
    totalBids: 98,
    flags: [
      { type: "Multiple accounts", severity: "high" },
      { type: "Unpaid wins", severity: "medium" },
      { type: "Rapid bidding", severity: "low" },
    ],
    unpaidWins: 3,
    multipleAccounts: 2,
    lastActivity: "2 hours ago",
    joinDate: "2024-01-12",
    status: "flagged",
  },
  {
    id: 2,
    name: "Unknown User 1",
    email: "user1.fake@temp.com",
    avatar: "",
    fraudScore: 92,
    riskLevel: "high",
    totalBids: 45,
    flags: [
      { type: "Fake email domain", severity: "high" },
      { type: "VPN usage detected", severity: "high" },
      { type: "Multiple accounts", severity: "high" },
    ],
    unpaidWins: 5,
    multipleAccounts: 4,
    lastActivity: "30 minutes ago",
    joinDate: "2024-03-10",
    status: "flagged",
  },
  {
    id: 3,
    name: "John Davis",
    email: "john.d@example.com",
    avatar: "",
    fraudScore: 54,
    riskLevel: "medium",
    totalBids: 128,
    flags: [
      { type: "Unusual bidding pattern", severity: "medium" },
      { type: "Rapid bid increase", severity: "low" },
    ],
    unpaidWins: 1,
    multipleAccounts: 0,
    lastActivity: "1 day ago",
    joinDate: "2023-09-10",
    status: "under_review",
  },
  {
    id: 4,
    name: "Test Account 42",
    email: "test42@mailinator.com",
    avatar: "",
    fraudScore: 78,
    riskLevel: "high",
    totalBids: 12,
    flags: [
      { type: "Disposable email", severity: "high" },
      { type: "No verification", severity: "medium" },
      { type: "Suspicious IP", severity: "medium" },
    ],
    unpaidWins: 2,
    multipleAccounts: 1,
    lastActivity: "5 hours ago",
    joinDate: "2024-03-14",
    status: "flagged",
  },
  {
    id: 5,
    name: "Maria Lopez",
    email: "maria.l@example.com",
    avatar: "",
    fraudScore: 35,
    riskLevel: "low",
    totalBids: 67,
    flags: [
      { type: "Unusual login location", severity: "low" },
    ],
    unpaidWins: 0,
    multipleAccounts: 0,
    lastActivity: "3 hours ago",
    joinDate: "2023-11-20",
    status: "cleared",
  },
]

const riskConfig: Record<RiskLevel, { label: string; className: string; cardClass: string }> = {
  high: { 
    label: "High Risk", 
    className: "bg-destructive text-destructive-foreground",
    cardClass: "border-l-4 border-l-destructive"
  },
  medium: { 
    label: "Medium Risk", 
    className: "bg-warning text-warning-foreground",
    cardClass: "border-l-4 border-l-warning"
  },
  low: { 
    label: "Safe", 
    className: "bg-accent text-accent-foreground",
    cardClass: "border-l-4 border-l-accent"
  },
}

const statusConfig: Record<FraudStatus, { label: string; className: string }> = {
  flagged: { label: "Flagged", className: "bg-destructive/10 text-destructive border-destructive/30" },
  under_review: { label: "Under Review", className: "bg-warning/10 text-warning border-warning/30" },
  cleared: { label: "Cleared", className: "bg-accent/10 text-accent border-accent/30" },
}

export default function FraudDetectionPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<SuspiciousUser | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredUsers = suspiciousUsers.filter((user) => {
    const matchesFilter = filter === "all" || user.riskLevel === filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    highRisk: suspiciousUsers.filter(u => u.riskLevel === "high").length,
    mediumRisk: suspiciousUsers.filter(u => u.riskLevel === "medium").length,
    totalFlagged: suspiciousUsers.filter(u => u.status === "flagged").length,
    underReview: suspiciousUsers.filter(u => u.status === "under_review").length,
  }

  const handleViewDetails = (user: typeof suspiciousUsers[0]) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  const handleSuspendUser = (user: typeof suspiciousUsers[0]) => {
    alert(`User ${user.name} has been suspended`)
  }

  const handleClearUser = (user: typeof suspiciousUsers[0]) => {
    alert(`User ${user.name} has been cleared`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-destructive" />
          Fraud Detection
        </h1>
        <p className="text-muted-foreground mt-1">Monitor and manage suspicious activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.highRisk}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.mediumRisk}</p>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <UserX className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalFlagged}</p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.underReview}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suspicious Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card 
            key={user.id} 
            className={`${riskConfig[user.riskLevel].cardClass} hover:bg-muted/30 transition-colors`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className={`${
                      user.riskLevel === "high" 
                        ? "bg-destructive/10 text-destructive" 
                        : user.riskLevel === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge className={riskConfig[user.riskLevel].className}>
                        {riskConfig[user.riskLevel].label}
                      </Badge>
                      <Badge variant="outline" className={statusConfig[user.status].className}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last active: {user.lastActivity}</p>
                  </div>
                </div>

                {/* Fraud Score */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="relative w-16 h-16">
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
                          className={`transition-all duration-500 ${
                            user.fraudScore >= 70 
                              ? "stroke-destructive" 
                              : user.fraudScore >= 40 
                              ? "stroke-warning" 
                              : "stroke-accent"
                          }`}
                          strokeWidth="10"
                          fill="none"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeLinecap="round"
                          strokeDasharray={`${user.fraudScore * 2.51} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-bold ${
                          user.fraudScore >= 70 
                            ? "text-destructive" 
                            : user.fraudScore >= 40 
                            ? "text-warning" 
                            : "text-accent"
                        }`}>
                          {user.fraudScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Fraud Score</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="hidden md:flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium text-foreground">{user.totalBids}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Bids</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-destructive">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{user.unpaidWins}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Unpaid</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-warning">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{user.multipleAccounts}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Multi-Acc</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 lg:flex-none"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  {user.status !== "cleared" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 lg:flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleSuspendUser(user)}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 lg:flex-none text-accent"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Cleared
                    </Button>
                  )}
                </div>
              </div>

              {/* Flags */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {user.flags.map((flag, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className={
                        flag.severity === "high" 
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : flag.severity === "medium"
                          ? "bg-warning/10 text-warning border-warning/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {flag.type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No suspicious users found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed fraud analysis for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 pt-4">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={`${
                    selectedUser.riskLevel === "high" 
                      ? "bg-destructive/10 text-destructive" 
                      : selectedUser.riskLevel === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {selectedUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <p className="text-xs text-muted-foreground">Joined: {selectedUser.joinDate}</p>
                </div>
              </div>

              {/* Fraud Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Fraud Score</span>
                  <span className={`font-bold ${
                    selectedUser.fraudScore >= 70 
                      ? "text-destructive" 
                      : selectedUser.fraudScore >= 40 
                      ? "text-warning" 
                      : "text-accent"
                  }`}>
                    {selectedUser.fraudScore}/100
                  </span>
                </div>
                <Progress 
                  value={selectedUser.fraudScore} 
                  className={`h-3 ${
                    selectedUser.fraudScore >= 70 
                      ? "[&>div]:bg-destructive" 
                      : selectedUser.fraudScore >= 40 
                      ? "[&>div]:bg-warning" 
                      : "[&>div]:bg-accent"
                  }`}
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xl font-bold">{selectedUser.totalBids}</p>
                  <p className="text-xs text-muted-foreground">Total Bids</p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 text-center">
                  <p className="text-xl font-bold text-destructive">{selectedUser.unpaidWins}</p>
                  <p className="text-xs text-muted-foreground">Unpaid Wins</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 text-center">
                  <p className="text-xl font-bold text-warning">{selectedUser.multipleAccounts}</p>
                  <p className="text-xs text-muted-foreground">Linked Accounts</p>
                </div>
              </div>

              {/* Flags */}
              <div>
                <h4 className="text-sm font-medium mb-3">Detected Issues</h4>
                <div className="space-y-2">
                  {selectedUser.flags.map((flag, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        flag.severity === "high" 
                          ? "bg-destructive/10"
                          : flag.severity === "medium"
                          ? "bg-warning/10"
                          : "bg-muted"
                      }`}
                    >
                      {flag.severity === "high" ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : flag.severity === "medium" ? (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      ) : (
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">{flag.type}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-auto ${
                          flag.severity === "high" 
                            ? "border-destructive/30 text-destructive"
                            : flag.severity === "medium"
                            ? "border-warning/30 text-warning"
                            : ""
                        }`}
                      >
                        {flag.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-accent"
                  onClick={() => {
                    handleClearUser(selectedUser)
                    setIsDetailOpen(false)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Clear User
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    handleSuspendUser(selectedUser)
                    setIsDetailOpen(false)
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
