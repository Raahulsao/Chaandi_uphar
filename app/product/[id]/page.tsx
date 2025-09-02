"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock product data
const products = {
  "1": {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    price: 7399,
    originalPrice: 11999,
    rating: 4.8,
    reviews: 9,
    images: [
      "/placeholder.svg?height=600&width=600&text=Rose+Gold+Necklace+1",
      "/placeholder.svg?height=600&width=600&text=Rose+Gold+Necklace+2",
      "/placeholder.svg?height=600&width=600&text=Rose+Gold+Necklace+3",
      "/placeholder.svg?height=600&width=600&text=Rose+Gold+Necklace+4",
    ],
    description: "Elegant rose gold necklace with intricate design perfect for special occasions.",
    features: ["18K Rose Gold Plated", "Hypoallergenic", "Water Resistant", "Gift Box Included"],
    specifications: {
      Material: "18K Rose Gold Plated Brass",
      "Chain Length": "16-18 inches (adjustable)",
      "Pendant Size": "2.5 cm x 1.8 cm",
      Weight: "12 grams",
      Closure: "Lobster Clasp",
    },
  },
  "2": {
    id: "2",
    name: "Golden Floral Moon Mangalsutra",
    price: 2999,
    originalPrice: 4599,
    rating: 4.8,
    reviews: 32,
    images: [
      "/placeholder.svg?height=600&width=600&text=Golden+Mangalsutra+1",
      "/placeholder.svg?height=600&width=600&text=Golden+Mangalsutra+2",
      "/placeholder.svg?height=600&width=600&text=Golden+Mangalsutra+3",
      "/placeholder.svg?height=600&width=600&text=Golden+Mangalsutra+4",
    ],
    description: "Traditional golden mangalsutra with modern floral moon design.",
    features: ["22K Gold Plated", "Traditional Design", "Adjustable Chain", "Authentic Craftsmanship"],
    specifications: {
      Material: "22K Gold Plated Silver",
      "Chain Length": "18-20 inches (adjustable)",
      "Pendant Size": "3 cm x 2.5 cm",
      Weight: "18 grams",
      Closure: "Traditional Hook",
    },
  },
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = products[productId as keyof typeof products]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div>Product not found</div>
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 lg:pt-36">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? "border-secondary" : "border-gray-200"
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
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {discount}% OFF
                  </Badge>
                </div>
                <p className="text-sm text-secondary font-medium">
                  Get it for ₹{(product.price * 0.8).toLocaleString()} with coupon
                </p>
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="px-3">
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {/* Updated buttons with slight rounding */}
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md">
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent rounded-md">
                    Buy Now
                  </Button>
                </div>

                <Button variant="ghost" className="w-full flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share this product</span>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span className="text-sm">1 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Certified Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border border-border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-medium">Anonymous User</span>
                        </div>
                        <p className="text-muted-foreground">
                          Beautiful piece of jewelry! The quality is excellent and it looks exactly like the pictures.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
