"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Award, ArrowLeft, Plus, Minus, ShoppingBag, Gem, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Enhanced product data with luxury styling
const products = {
  "1": {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    price: 7399,
    originalPrice: 11999,
    rating: 4.8,
    reviews: 156,
    images: ["/hero-jewelry.png", "/New Ring.jpeg", "/Untitled design (10).png", "/Untitled design (1).png"],
    description: "Exquisite rose gold necklace featuring intricate craftsmanship and timeless elegance. Perfect for special occasions and everyday luxury.",
    features: ["18K Rose Gold Plated", "Hypoallergenic Materials", "Water & Tarnish Resistant", "Premium Gift Box Included", "Lifetime Warranty"],
    specifications: {
      Material: "18K Rose Gold Plated Sterling Silver",
      "Chain Length": "16-18 inches (adjustable)",
      "Pendant Size": "2.5 cm x 1.8 cm",
      Weight: "12 grams",
      Closure: "Secure Lobster Clasp",
      "Stone Type": "Premium Cubic Zirconia",
    },
    category: "Necklaces",
    sku: "CU-NL-001",
  },
  "2": {
    id: "2",
    name: "Golden Floral Moon Mangalsutra",
    price: 2999,
    originalPrice: 4599,
    rating: 4.9,
    reviews: 89,
    images: ["/Untitled design (2) (1).png", "/Untitled design (3) (1).png", "/18-kt-jew-desktop.webp", "/Gemini.png"],
    description: "Traditional golden mangalsutra with contemporary floral moon design, blending heritage with modern aesthetics.",
    features: ["22K Gold Plated", "Traditional Craftsmanship", "Adjustable Chain Length", "Authentic Design", "Sacred Blessing Included"],
    specifications: {
      Material: "22K Gold Plated Silver",
      "Chain Length": "18-20 inches (adjustable)",
      "Pendant Size": "3 cm x 2.5 cm",
      Weight: "18 grams",
      Closure: "Traditional Hook & Eye",
      "Design Origin": "Traditional Indian",
    },
    category: "Mangalsutra",
    sku: "CU-MS-002",
  },
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = products[productId as keyof typeof products]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Gem className="w-16 h-16 text-[#ff8fab] mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Product Not Found</h1>
          <p className="text-gray-600 font-serif">The jewelry piece you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif rounded-xl">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-pink-50/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-24 h-24 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -right-8 w-32 h-32 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#ff8fab]/5 rounded-full blur-xl"></div>
      </div>

      <main className="relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm font-serif">
              <Link href="/" className="text-[#ff8fab] hover:text-[#ff7a9a] flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{product.category}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-4">
            {/* Product Images */}
            <div className="lg:col-span-4 space-y-2 w-full max-w-none sm:max-w-md lg:max-w-xl mx-auto lg:mx-0">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md border border-gray-100">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`absolute top-2 right-2 w-7 lg:w-8 h-7 lg:h-8 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-[#ff8fab] text-white hover:bg-[#ff7a9a]' 
                      : 'bg-white/95 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-3 lg:w-4 h-3 lg:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#ff8fab] text-white font-semibold px-2 py-1 text-xs rounded-md shadow-md">
                      {discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-1.5">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-md transition-all duration-300 ${
                      selectedImage === index 
                        ? "ring-2 ring-[#ff8fab] ring-offset-1 shadow-md" 
                        : "ring-1 ring-gray-200 hover:ring-[#ff8fab]/60 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-4 space-y-4 lg:space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[#ff8fab] border-[#ff8fab] font-serif text-xs lg:text-sm">
                    {product.category}
                  </Badge>
                  <span className="text-xs lg:text-sm text-gray-500 font-serif">SKU: {product.sku}</span>
                </div>
                
                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 font-serif leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 lg:w-5 h-4 lg:h-5 ${
                          star <= Math.floor(product.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-base lg:text-lg font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <div className="h-3 lg:h-4 w-px bg-gray-300"></div>
                  <span className="text-gray-600 font-serif text-sm lg:text-base">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 lg:p-4 space-y-2 border border-pink-100">
                <div className="flex items-center space-x-3">
                  <span className="text-xl lg:text-3xl font-bold text-gray-900 font-serif">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-base lg:text-xl text-gray-500 line-through font-serif">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[#ff8fab] font-semibold font-serif flex items-center text-xs lg:text-base">
                  <Sparkles className="w-3 lg:w-4 h-3 lg:h-4 mr-1" />
                  Special Offer: Get additional 10% off with code LUXURY10
                </p>
                <p className="text-xs lg:text-sm text-gray-600 font-serif">
                  EMI starting from ₹{Math.round(product.price / 12).toLocaleString()}/month
                </p>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed font-serif text-sm lg:text-base">{product.description}</p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-gray-900 font-serif">Quantity:</label>
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 h-7 hover:bg-[#ff8fab]/10 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-50 min-w-[32px] text-center">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="px-2 py-1 h-7 hover:bg-[#ff8fab]/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                    <Button className="h-9 lg:h-11 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-serif text-sm lg:text-base">
                      <ShoppingBag className="w-4 lg:w-5 h-4 lg:h-5 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-9 lg:h-11 border border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-semibold rounded-lg transition-all duration-300 font-serif text-sm lg:text-base"
                    >
                      Buy Now
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full h-8 text-gray-600 hover:text-[#ff8fab] hover:bg-[#ff8fab]/5 rounded-lg transition-all duration-300 font-serif text-sm"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share this piece
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 lg:gap-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 p-2 lg:p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-6 lg:w-8 h-6 lg:h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Truck className="w-3 lg:w-4 h-3 lg:h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-xs lg:text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders above ₹2,999</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 lg:p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-6 lg:w-8 h-6 lg:h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Shield className="w-3 lg:w-4 h-3 lg:h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-xs lg:text-sm">Lifetime Warranty</p>
                    <p className="text-xs text-gray-600">Authentic guarantee</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 lg:p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-6 lg:w-8 h-6 lg:h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-3 lg:w-4 h-3 lg:h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-xs lg:text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">30-day return policy</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 lg:p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="w-6 lg:w-8 h-6 lg:h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                    <Award className="w-3 lg:w-4 h-3 lg:h-4 text-[#ff8fab]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-serif text-xs lg:text-sm">Certified Quality</p>
                    <p className="text-xs text-gray-600">Premium materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information - Continuous List */}
          <div className="mt-6 lg:mt-8 space-y-4">
            
            {/* Details Section */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-serif flex items-center mb-3">
                <Gem className="w-4 h-4 mr-2 text-[#ff8fab]" />
                Premium Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-md">
                    <div className="w-1 h-1 bg-[#ff8fab] rounded-full" />
                    <span className="font-serif text-gray-800 text-xs">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-gradient-to-r from-[#ff8fab]/5 to-purple-100/30 rounded-md border border-[#ff8fab]/20">
                <p className="text-gray-700 font-serif text-xs leading-relaxed">
                  Each piece is carefully crafted by our master artisans using traditional techniques 
                  combined with modern precision. Our jewelry represents the perfect fusion of 
                  timeless elegance and contemporary style.
                </p>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-serif mb-3">Technical Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100 last:border-b-0">
                    <span className="font-semibold text-gray-900 font-serif text-xs">{key}:</span>
                    <span className="text-gray-700 font-serif text-xs mt-1 sm:mt-0">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 font-serif">Customer Reviews</h3>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{product.rating}</span>
                  <span className="text-gray-500 text-xs">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    name: "Priya S.",
                    rating: 5,
                    date: "2 weeks ago",
                    review: "Absolutely stunning piece! The craftsmanship is exceptional and it looks even more beautiful in person."
                  },
                  {
                    name: "Anjali R.",
                    rating: 5,
                    date: "1 month ago",
                    review: "Perfect for my wedding ceremony. The traditional design with modern touch is exactly what I was looking for."
                  },
                  {
                    name: "Meera K.",
                    rating: 4,
                    date: "2 months ago",
                    review: "Beautiful jewelry with great quality. The only minor issue was the delivery time, but the product quality makes up for it."
                  }
                ].map((review, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-pink-50/30 rounded-md border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#ff8fab] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">{review.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 font-serif text-xs">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex mt-1 sm:mt-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${
                              star <= review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 font-serif leading-relaxed text-xs">{review.review}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-3">
                <Button 
                  variant="outline" 
                  className="border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white rounded-md font-serif transition-all duration-300 text-xs h-7 px-4"
                >
                  Load More Reviews
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
