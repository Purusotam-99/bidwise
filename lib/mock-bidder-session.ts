"use client"

export type WalletTransactionType = "received" | "used" | "refunded"

export type WalletTransaction = {
  id: number
  type: WalletTransactionType
  description: string
  amount: number
  date: string
  reference: string
}

export type MockBidderSession = {
  name: string
  email: string
  phone: string
  isVerified: boolean
  walletBalance: number
  transactions: WalletTransaction[]
}

const STORAGE_KEY = "bidwiseBidderSession"
const UPDATE_EVENT = "bidwise:session-updated"
const DEFAULT_WALLET_BALANCE = 100

const createReference = (prefix: string) =>
  `${prefix}-${Date.now().toString().slice(-6)}`

const today = () => new Date().toISOString().slice(0, 10)

export function createDefaultBidderSession(
  overrides: Partial<Omit<MockBidderSession, "transactions" | "walletBalance">> = {}
): MockBidderSession {
  return {
    name: overrides.name || "Bidder",
    email: overrides.email || "bidder@bidwise.com",
    phone: overrides.phone || "",
    isVerified: overrides.isVerified ?? false,
    walletBalance: DEFAULT_WALLET_BALANCE,
    transactions: [
      {
        id: 1,
        type: "received",
        description: "Welcome bonus on registration",
        amount: DEFAULT_WALLET_BALANCE,
        date: today(),
        reference: createReference("REG"),
      },
    ],
  }
}

function isBrowser() {
  return typeof window !== "undefined"
}

function emitSessionUpdate() {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

export function getStoredBidderSession() {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MockBidderSession
  } catch {
    return null
  }
}

export function saveBidderSession(session: MockBidderSession) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  emitSessionUpdate()
}

export function ensureBidderSession(
  overrides: Partial<Omit<MockBidderSession, "transactions" | "walletBalance">> = {}
) {
  const existing = getStoredBidderSession()
  if (existing) return existing

  const session = createDefaultBidderSession(overrides)
  saveBidderSession(session)
  return session
}

export function replaceBidderSession(
  overrides: Partial<Omit<MockBidderSession, "transactions" | "walletBalance">>
) {
  const session = createDefaultBidderSession(overrides)
  saveBidderSession(session)
  return session
}

export function updateBidderWallet(
  amount: number,
  transaction: Omit<WalletTransaction, "id" | "date">
) {
  const session = ensureBidderSession()
  const nextTransaction: WalletTransaction = {
    id: Date.now(),
    date: today(),
    ...transaction,
  }

  const nextSession: MockBidderSession = {
    ...session,
    walletBalance: session.walletBalance + amount,
    transactions: [nextTransaction, ...session.transactions],
  }

  saveBidderSession(nextSession)
  return nextSession
}

export function addCreditsToWallet(amount: number, cardSuffix: string) {
  return updateBidderWallet(amount, {
    type: "received",
    description: `Credits purchased via card ${cardSuffix}`,
    amount,
    reference: createReference("TXN"),
  })
}

export function reserveBidCredits(auctionTitle: string, amount: number) {
  return updateBidderWallet(-amount, {
    type: "used",
    description: `Reserved for bid - ${auctionTitle}`,
    amount: -amount,
    reference: createReference("BID"),
  })
}

export function refundBidCredits(auctionTitle: string, amount: number) {
  return updateBidderWallet(amount, {
    type: "refunded",
    description: `Bid refund - ${auctionTitle}`,
    amount,
    reference: createReference("REF"),
  })
}

export function subscribeToBidderSessionUpdates(callback: () => void) {
  if (!isBrowser()) return () => {}

  const handleCustomEvent = () => callback()
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback()
  }

  window.addEventListener(UPDATE_EVENT, handleCustomEvent)
  window.addEventListener("storage", handleStorage)

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleCustomEvent)
    window.removeEventListener("storage", handleStorage)
  }
}
