"use client"

import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  Upload,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMockAuctions } from "@/lib/mock-auctions"

const formatAdminDate = (date: Date) => date.toISOString().slice(0, 16).replace("T", " ")

const auctionsData = getMockAuctions().map((auction) => {
  const endsSoon = auction.endTime.getTime() - Date.now() <= 60 * 60 * 1000
  const isClosed = auction.endTime.getTime() <= Date.now()
  const estimatedStartTime = new Date(auction.endTime.getTime() - 72 * 60 * 60 * 1000)

  return {
    id: auction.id,
    title: auction.title,
    image: auction.image,
    images: auction.images,
    category: auction.category,
    minimumBid: auction.minimumBid,
    currentBid: auction.currentBid,
    bids: auction.totalBids,
    status: isClosed ? "completed" : endsSoon ? "ending" : "active",
    startTime: formatAdminDate(estimatedStartTime),
    endTime: formatAdminDate(auction.endTime),
  }
})

type AuctionStatus = "active" | "ending" | "completed" | "scheduled"

const statusConfig: Record<AuctionStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-accent/10 text-accent border-accent/30" },
  ending: { label: "Ending Soon", className: "bg-warning/10 text-warning border-warning/30" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/30" },
}

export default function ManageAuctionsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    category: "",
    minimumBid: "",
    startTime: "",
    endTime: "",
    images: [] as { url: string; name: string }[],
  })

  const updateAuctionImages = (files: FileList | File[]) => {
    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 6)
      .map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }))

    if (nextImages.length === 0) return

    setNewAuction((prev) => ({
      ...prev,
      images: nextImages,
    }))
  }

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return
    updateAuctionImages(event.target.files)
  }

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingImage(false)
    if (!event.dataTransfer.files?.length) return
    updateAuctionImages(event.dataTransfer.files)
  }

  const filteredAuctions = auctionsData.filter((auction) => {
    const matchesFilter = filter === "all" || auction.status === filter
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleCreateAuction = () => {
    alert("Auction created successfully!")
    setIsCreateOpen(false)
    setNewAuction({
      title: "",
      description: "",
      category: "",
      minimumBid: "",
      startTime: "",
      endTime: "",
      images: [],
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Manage Auctions
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage auction listings</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Auction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Auction</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new auction listing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Auction Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelection}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDraggingImage(true)
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={handleImageDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDraggingImage ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  {newAuction.images.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {newAuction.images.map((image, index) => (
                          <img
                            key={`${image.name}-${index}`}
                            src={image.url}
                            alt={image.name}
                            className={`h-24 w-full rounded-lg object-cover ${
                              index === 0 ? "ring-2 ring-primary" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {newAuction.images.length} image{newAuction.images.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Add multiple product angles or styles. The first image will be used as the cover.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to add images or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP. Add up to 6 images.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter auction title"
                  value={newAuction.title}
                  onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter auction description"
                  rows={3}
                  value={newAuction.description}
                  onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newAuction.category} 
                  onValueChange={(value) => setNewAuction({ ...newAuction, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="watches">Watches</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                    <SelectItem value="antiques">Antiques</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Bid */}
              <div className="space-y-2">
                <Label htmlFor="minimumBid">Minimum Bid ($)</Label>
                <Input
                  id="minimumBid"
                  type="number"
                  placeholder="Enter minimum bid amount"
                  value={newAuction.minimumBid}
                  onChange={(e) => setNewAuction({ ...newAuction, minimumBid: e.target.value })}
                />
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="datetime-local"
                    className="pl-10"
                    value={newAuction.startTime}
                    onChange={(e) => setNewAuction({ ...newAuction, startTime: e.target.value })}
                  />
                </div>
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="datetime-local"
                    className="pl-10"
                    value={newAuction.endTime}
                    onChange={(e) => setNewAuction({ ...newAuction, endTime: e.target.value })}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleCreateAuction}>
                Create Auction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auctions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ending">Ending Soon</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Auction</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Min Bid</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Current</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Bids</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuctions.map((auction) => (
                  <TableRow key={auction.id}>
                    {(() => {
                      const auctionStatus = auction.status as AuctionStatus

                      return (
                        <>
                          <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{auction.title}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{auction.category}</p>
                          <p className="text-xs text-muted-foreground">{auction.images.length} images</p>
                        </div>
                      </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{auction.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                      ${auction.minimumBid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary hidden sm:table-cell">
                      ${auction.currentBid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center hidden lg:table-cell">
                      {auction.bids}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={statusConfig[auctionStatus].className}>
                              {auctionStatus === "ending" && <Clock className="w-3 h-3 mr-1" />}
                              {statusConfig[auctionStatus].label}
                            </Badge>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Auction
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </TableCell>
                        </>
                      )
                    })()}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAuctions.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No auctions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
