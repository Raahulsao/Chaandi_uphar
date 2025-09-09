"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Trash2, ArrowLeft, Crown, Sparkles, Gift, Award } from "lucide-react"
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
    category: "Necklaces"
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
    category: "Pendants"
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
    category: "Rings"
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-pink-50/30">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-4 w-24 h-24 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 -right-8 w-32 h-32 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        </div>
        
        <main className="relative z-10 pt-6 lg:pt-10">
          {/* Breadcrumb */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center space-x-2 text-sm font-serif">
                <Link href="/" className="text-[#ff8fab] hover:text-[#ff7a9a] flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Wishlist</span>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif mb-4">Your wishlist is empty</h1>
              <p className="text-gray-600 font-serif mb-8">Save items you love to your wishlist and shop them later. Discover our beautiful jewelry collection.</p>
              <Link href="/">
                <Button className="bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <Crown className="w-4 h-4 mr-2" />
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-pink-50/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-24 h-24 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -right-8 w-32 h-32 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
      </div>
      
      <main className="relative z-10 pt-6 lg:pt-10">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm font-serif">
              <Link href="/" className="text-[#ff8fab] hover:text-[#ff7a9a] flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Wishlist</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif flex items-center">
              <Heart className="w-6 lg:w-8 h-6 lg:h-8 mr-2 text-red-500" />
              My Wishlist ({items.length} items)
            </h1>
            <Button 
              variant="outline" 
              className="mt-3 sm:mt-0 border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif"
            >
              <Gift className="w-4 h-4 mr-2" />
              Share Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <button
                  type="button"
                  onClick={() => toggleImage(item.id)}
                  className="relative aspect-square w-full overflow-hidden bg-white"
                  title="Tap to view alternate"
                >
                  <Image
                    src={(showAlt[item.id] ? item.image2 : item.image) || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.05] bg-white p-4"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#ff8fab]/90 text-white text-xs font-serif font-semibold px-2 py-1 rounded-lg">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-12">
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 rounded-full w-8 h-8 shadow-md"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="absolute left-3 bottom-20 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs shadow-md">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{item.rating}</span>
                  <span className="text-gray-600">({item.reviews})</span>
                </div>

                <div className="p-4 lg:p-5">
                  <h3 className="font-bold text-gray-900 font-serif mb-2 text-sm lg:text-base line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-[#ff8fab] font-serif text-base lg:text-lg">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through font-serif">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className={`w-full font-serif text-sm rounded-lg transition-all duration-300 ${
                        item.inStock 
                          ? 'bg-[#ff8fab] hover:bg-[#ff7a9a] text-white shadow-md hover:shadow-lg' 
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Notify When Available"}
                    </Button>
                    <Link href={`/product/${item.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif text-sm rounded-lg transition-all duration-300"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 lg:mt-16">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#ff8fab] to-purple-400 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif mb-4">You might also like</h2>
                <p className="text-gray-600 font-serif mb-6 lg:mb-8">Discover more beautiful jewelry pieces from our curated collections that complement your style.</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link href="/">
                    <Button className="bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      <Crown className="w-4 h-4 mr-2" />
                      Explore More Products
                    </Button>
                  </Link>
                  <Link href="/gifts">
                    <Button variant="outline" className="border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif px-6 py-3 rounded-lg transition-all duration-300">
                      <Gift className="w-4 h-4 mr-2" />
                      Gift Collections
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
