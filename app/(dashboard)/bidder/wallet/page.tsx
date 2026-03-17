"use client"

import { useEffect, useState } from "react"
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Trophy, 
  Plus, 
  CreditCard,
  TrendingUp,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  addCreditsToWallet,
  ensureBidderSession,
  getStoredBidderSession,
  subscribeToBidderSessionUpdates,
  type WalletTransaction,
  type WalletTransactionType,
} from "@/lib/mock-bidder-session"

const transactionConfig: Record<
  WalletTransactionType,
  { icon: typeof ArrowDownRight; className: string; badge: string }
> = {
  received: { 
    icon: ArrowDownRight, 
    className: "text-accent bg-accent/10",
    badge: "Received"
  },
  used: { 
    icon: Trophy, 
    className: "text-primary bg-primary/10",
    badge: "Used"
  },
  refunded: { 
    icon: RefreshCw, 
    className: "text-muted-foreground bg-muted",
    badge: "Refunded"
  },
}

export default function WalletPage() {
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [currentBalance, setCurrentBalance] = useState(100)

  useEffect(() => {
    const syncSession = () => {
      const session = getStoredBidderSession() ?? ensureBidderSession()
      setTransactions(session.transactions)
      setCurrentBalance(session.walletBalance)
    }

    syncSession()
    return subscribeToBidderSessionUpdates(syncSession)
  }, [])

  const totalReceived = transactions.filter(t => t.type === "received").reduce((sum, t) => sum + t.amount, 0)
  const totalUsed = Math.abs(transactions.filter(t => t.type === "used").reduce((sum, t) => sum + t.amount, 0))
  const totalRefunded = transactions.filter(t => t.type === "refunded").reduce((sum, t) => sum + t.amount, 0)

  const handleAddCredits = () => {
    const amount = Number(creditAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid credit amount")
      return
    }

    const digitsOnly = cardNumber.replace(/\D/g, "")
    const cardSuffix = digitsOnly.slice(-4) || "1234"
    addCreditsToWallet(amount, cardSuffix)

    alert(`Added ${amount} credits to your wallet`)
    setIsAddCreditsOpen(false)
    setCreditAmount("")
    setCardNumber("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Credits Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Manage your auction credits</p>
        </div>
        
        <Dialog open={isAddCreditsOpen} onOpenChange={setIsAddCreditsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credits</DialogTitle>
              <DialogDescription>
                Purchase credits to use for bidding on auctions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="credit-amount">Amount</Label>
                <Input
                  id="credit-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  placeholder="1111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setCreditAmount(amount.toString())}
                    className={creditAmount === amount.toString() ? "border-primary" : ""}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <Button className="w-full" onClick={handleAddCredits} disabled={!creditAmount}>
                <CreditCard className="w-4 h-4 mr-2" />
                Purchase Credits
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {currentBalance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Available credits</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-accent mt-1">
                  +{totalReceived.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Used</p>
                <p className="text-2xl font-bold text-destructive mt-1">
                  -{totalUsed.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Refunded</p>
                <p className="text-2xl font-bold mt-1">
                  +{totalRefunded.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Reference</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const config = transactionConfig[transaction.type]
                  const Icon = config.icon
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.className}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <Badge variant="outline" className="hidden sm:inline-flex">
                            {config.badge}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs hidden sm:table-cell">
                        {transaction.reference}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        <span className={transaction.amount > 0 ? "text-accent" : "text-destructive"}>
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
