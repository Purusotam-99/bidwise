"use client"

import { useState } from "react"
import { 
  User, 
  Shield, 
  Trophy, 
  Target, 
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Edit,
  Camera
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  avatar: "",
  isVerified: true,
  memberSince: "March 2023",
  stats: {
    totalParticipated: 47,
    totalWon: 23,
    winningPercentage: 49,
  },
  recentWins: [
    { id: 1, title: "Vintage Rolex Submariner", amount: 4500, date: "Mar 15, 2024" },
    { id: 2, title: "Japanese Ceramic Vase", amount: 750, date: "Mar 13, 2024" },
    { id: 3, title: "Art Deco Table Lamp", amount: 560, date: "Mar 11, 2024" },
  ],
}

export default function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  })

  const handleSaveProfile = () => {
    alert("Profile updated successfully!")
    setIsEditOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and view your statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {userData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Name & Verification */}
              <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
              {userData.isVerified && (
                <Badge className="mt-2 bg-accent/10 text-accent border-accent/30 gap-1">
                  <Shield className="w-3 h-3" />
                  DigiLocker Verified
                </Badge>
              )}

              {/* Contact Info */}
              <div className="w-full mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {userData.memberSince}</span>
                </div>
              </div>

              {/* Edit Button */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-6 gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Participated</p>
                    <p className="text-2xl font-bold">{userData.stats.totalParticipated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Auctions Won</p>
                    <p className="text-2xl font-bold text-accent">{userData.stats.totalWon}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">{userData.stats.winningPercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Winning Percentage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Winning Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-40 h-40 flex-shrink-0">
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
                      className="stroke-primary transition-all duration-1000"
                      strokeWidth="10"
                      fill="none"
                      r="40"
                      cx="50"
                      cy="50"
                      strokeLinecap="round"
                      strokeDasharray={`${userData.stats.winningPercentage * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{userData.stats.winningPercentage}%</span>
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                  </div>
                </div>

                {/* Stats breakdown */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Auctions Won</span>
                      <span className="font-medium">{userData.stats.totalWon}</span>
                    </div>
                    <Progress value={(userData.stats.totalWon / userData.stats.totalParticipated) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Auctions Lost</span>
                      <span className="font-medium">{userData.stats.totalParticipated - userData.stats.totalWon}</span>
                    </div>
                    <Progress 
                      value={((userData.stats.totalParticipated - userData.stats.totalWon) / userData.stats.totalParticipated) * 100} 
                      className="h-2 [&>div]:bg-muted-foreground" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Recent Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentWins.map((win, index) => (
                  <div 
                    key={win.id} 
                    className={`flex items-center justify-between py-3 ${
                      index < userData.recentWins.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{win.title}</p>
                        <p className="text-xs text-muted-foreground">{win.date}</p>
                      </div>
                    </div>
                    <p className="font-bold text-accent">${win.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
