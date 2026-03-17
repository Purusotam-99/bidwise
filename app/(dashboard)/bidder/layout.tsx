"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Gavel,
  LayoutDashboard,
  History,
  Wallet,
  User,
  Bell,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Search,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ensureBidderSession,
  getStoredBidderSession,
  subscribeToBidderSessionUpdates,
} from "@/lib/mock-bidder-session"

const navigation = [
  { name: "Dashboard", href: "/bidder/dashboard", icon: LayoutDashboard },
  { name: "Browse Auctions", href: "/bidder/browse", icon: Search },
  { name: "AI Insights", href: "/bidder/ai-insights", icon: Sparkles },
  { name: "Bid Center", href: "/bidder/bids", icon: Gavel },
  { name: "My Bid History", href: "/bidder/history", icon: History },
  { name: "Credits Wallet", href: "/bidder/wallet", icon: Wallet },
  { name: "Profile", href: "/bidder/profile", icon: User },
]

export default function BidderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [bidderName, setBidderName] = useState("Bidder")

  useEffect(() => {
    const syncSession = () => {
      const session = getStoredBidderSession() ?? ensureBidderSession()
      setBidderName(session.name || "Bidder")
    }

    syncSession()
    return subscribeToBidderSessionUpdates(syncSession)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Gavel className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">BidWise</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="/avatars/user.jpg" />
                  <AvatarFallback>
                    {bidderName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bidderName}</p>
                <p className="text-xs text-muted-foreground truncate">Premium Bidder</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="py-2">
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="font-medium">You have been outbid!</span>
                  <span className="text-xs text-muted-foreground">
                    Vintage Watch - Current bid: $2,500
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="font-medium">Auction ending soon</span>
                  <span className="text-xs text-muted-foreground">
                    Classic Car Model - 30 minutes left
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="font-medium">You won an auction!</span>
                  <span className="text-xs text-muted-foreground">
                    Antique Vase - Final bid: $1,200
                  </span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatars/user.jpg" />
                  <AvatarFallback>
                    {bidderName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{bidderName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/bidder/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bidder/wallet">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
