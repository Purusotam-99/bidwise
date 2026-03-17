export type AuctionBidHistoryItem = {
  id: number
  bidder: string
  amount: number
  time: string
}

export type MockAuction = {
  id: number
  title: string
  description: string
  category: string
  image: string
  images: string[]
  currentBid: number
  minimumBid: number
  endTime: Date
  totalBids: number
  isWatching: boolean
  bidHistory: AuctionBidHistoryItem[]
}

const createEndTime = (hoursFromNow: number) => new Date(Date.now() + hoursFromNow * 60 * 60 * 1000)

export const mockAuctions: MockAuction[] = [
  {
    id: 1,
    title: "Vintage Rolex Submariner 1969",
    description:
      "An exceptional vintage Rolex Submariner from 1969 in excellent condition with original dial, hands, and bezel insert. Complete with original box and papers.",
    category: "Watches",
    image: "/auctions/watch.jpg",
    images: [
      "/auctions/watch.jpg",
      "/auctions/watch-2.jpg",
      "/auctions/watch-3.jpg",
    ],
    currentBid: 4500,
    minimumBid: 3500,
    endTime: createEndTime(2),
    totalBids: 23,
    isWatching: true,
    bidHistory: [
      { id: 1, bidder: "Alex M.", amount: 4500, time: "2 min ago" },
      { id: 2, bidder: "Sarah K.", amount: 4300, time: "5 min ago" },
      { id: 3, bidder: "John D.", amount: 4100, time: "12 min ago" },
    ],
  },
  {
    id: 2,
    title: "1967 Ford Mustang Model",
    description:
      "Highly detailed collectible Mustang model with original packaging, metal bodywork, and immaculate interior finish. A sought-after piece for car enthusiasts.",
    category: "Collectibles",
    image: "/auctions/mustang.jpg",
    images: [
      "/auctions/mustang.jpg",
      "/auctions/mustang-2.jpg",
      "/auctions/mustang-3.jpg",
    ],
    currentBid: 1200,
    minimumBid: 800,
    endTime: createEndTime(5),
    totalBids: 45,
    isWatching: false,
    bidHistory: [
      { id: 4, bidder: "Ravi P.", amount: 1200, time: "4 min ago" },
      { id: 5, bidder: "Neha A.", amount: 1100, time: "9 min ago" },
      { id: 6, bidder: "Tom B.", amount: 1000, time: "15 min ago" },
    ],
  },
  {
    id: 3,
    title: "Antique Victorian Mirror",
    description:
      "Hand-carved Victorian wall mirror with ornate gold detailing and beveled antique glass. A statement piece with beautiful age and character.",
    category: "Antiques",
    image: "/auctions/mirror.jpg",
    images: [
      "/auctions/mirror.jpg",
      "/auctions/mirror-2.jpg",
      "/auctions/mirror-3.jpg",
    ],
    currentBid: 890,
    minimumBid: 500,
    endTime: createEndTime(0.75),
    totalBids: 12,
    isWatching: true,
    bidHistory: [
      { id: 7, bidder: "Priya S.", amount: 890, time: "1 min ago" },
      { id: 8, bidder: "Nolan K.", amount: 820, time: "6 min ago" },
      { id: 9, bidder: "Mia T.", amount: 760, time: "12 min ago" },
    ],
  },
  {
    id: 4,
    title: "Rare First Edition Book",
    description:
      "First edition hardback in collector-grade condition with intact dust jacket and author signature. Ideal for rare literature collectors.",
    category: "Books",
    image: "/auctions/book.jpg",
    images: [
      "/auctions/book.jpg",
      "/auctions/book-2.jpg",
      "/auctions/book-3.jpg",
    ],
    currentBid: 2100,
    minimumBid: 1500,
    endTime: createEndTime(8),
    totalBids: 31,
    isWatching: false,
    bidHistory: [
      { id: 10, bidder: "Lena G.", amount: 2100, time: "10 min ago" },
      { id: 11, bidder: "Chris P.", amount: 1980, time: "25 min ago" },
      { id: 12, bidder: "Arun D.", amount: 1860, time: "41 min ago" },
    ],
  },
  {
    id: 5,
    title: "Japanese Ceramic Vase",
    description:
      "Elegant hand-painted ceramic vase sourced from Kyoto, featuring delicate floral motifs and a rich lacquered finish.",
    category: "Art",
    image: "/auctions/vase.jpg",
    images: [
      "/auctions/vase.jpg",
      "/auctions/vase-2.jpg",
      "/auctions/vase-3.jpg",
    ],
    currentBid: 750,
    minimumBid: 400,
    endTime: createEndTime(0.9),
    totalBids: 8,
    isWatching: true,
    bidHistory: [
      { id: 13, bidder: "Aiko N.", amount: 750, time: "3 min ago" },
      { id: 14, bidder: "Emma R.", amount: 680, time: "11 min ago" },
      { id: 15, bidder: "Noah F.", amount: 620, time: "19 min ago" },
    ],
  },
  {
    id: 6,
    title: "Vintage Camera Collection",
    description:
      "A curated set of analog cameras featuring working shutters, original leather cases, and collectible lenses across multiple eras.",
    category: "Electronics",
    image: "/auctions/camera.jpg",
    images: [
      "/auctions/camera.jpg",
      "/auctions/camera-2.jpg",
      "/auctions/camera-3.jpg",
    ],
    currentBid: 3200,
    minimumBid: 2000,
    endTime: createEndTime(3),
    totalBids: 19,
    isWatching: false,
    bidHistory: [
      { id: 16, bidder: "Leo M.", amount: 3200, time: "7 min ago" },
      { id: 17, bidder: "Sara V.", amount: 3050, time: "13 min ago" },
      { id: 18, bidder: "James W.", amount: 2900, time: "22 min ago" },
    ],
  },
]

export function getMockAuctions() {
  return mockAuctions.map((auction) => ({
    ...auction,
    endTime: new Date(auction.endTime),
    images: [...auction.images],
    bidHistory: auction.bidHistory.map((bid) => ({ ...bid })),
  }))
}

export function getMockAuctionById(id: number) {
  return getMockAuctions().find((auction) => auction.id === id) ?? null
}
