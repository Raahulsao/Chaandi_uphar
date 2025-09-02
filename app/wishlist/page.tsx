"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const wishlistItems = [
  {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    price: 7399,
    originalPrice: 11999,
    rating: 4.8,
    reviews: 9,
    image: "/rose-gold-pretty-woman-necklace.png",
    image2: "/rose-gold-pretty-woman-necklace-alt.png",
    inStock: true,
  },
  {
    id: "2",
    name: "Silver Mahabali Hanuman Pendant",
    price: 3499,
    originalPrice: 5599,
    rating: 4.7,
    reviews: 47,
    image: "/silver-mahabali-hanuman-pendant.png",
    image2: "/silver-mahabali-hanuman-pendant-alt.png",
    inStock: true,
  },
  {
    id: "3",
    name: "Diamond Eternity Ring",
    price: 12999,
    originalPrice: 18999,
    rating: 5.0,
    reviews: 23,
    image: "/diamond-eternity-ring.png",
    image2: "/diamond-eternity-ring-alt.png",
    inStock: false,
  },
]

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems)
  const [showAlt, setShowAlt] = useState<Record<string, boolean>>({})

  const removeFromWishlist = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const toggleImage = (id: string) => {
    setShowAlt((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-10 lg:pt-14">
          <div className="container mx-auto px-4 py-16 text-center">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">Save items you love to your wishlist and shop them later.</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 lg:pt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">My Wishlist ({items.length} items)</h1>
            <Button variant="outline" className="hidden md:block bg-transparent rounded-full">
              Share Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => toggleImage(item.id)}
                  className="relative aspect-square w-full overflow-hidden"
                  title="Tap to view alternate"
                >
                  <Image
                    src={(showAlt[item.id] ? item.image2 : item.image) || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02] bg-white"
                  />
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-full"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="absolute left-2 bottom-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{item.rating}</span>
                  <span className="text-muted-foreground">({item.reviews})</span>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-foreground mb-1 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full rounded-lg" disabled={!item.inStock}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Notify When Available"}
                    </Button>
                    <Link href={`/product/${item.id}`}>
                      <Button variant="outline" className="w-full rounded-lg bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">You might also like</h2>
            <p className="text-muted-foreground mb-6">Discover more beautiful jewelry pieces</p>
            <Link href="/">
              <Button variant="outline">Explore More Products</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
