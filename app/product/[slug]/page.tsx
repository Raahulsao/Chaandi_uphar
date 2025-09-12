"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Award, ArrowLeft, Plus, Minus, ShoppingBag, Gem, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/supabase"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setProduct(data[0])
        } else {
          setError('Product not found')
        }
      } else {
        // Fallback to demo product
        setProduct(getDemoProduct())
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product')
      setProduct(getDemoProduct())
    } finally {
      setLoading(false)
    }
  }

  const getDemoProduct = (): Product => ({
    id: '1',
    name: 'Rose Gold Pretty Woman Necklace',
    slug: slug,
    description: 'Exquisite rose gold necklace featuring intricate craftsmanship and timeless elegance. Perfect for special occasions and everyday luxury.',
    short_description: 'Elegant rose gold necklace with premium craftsmanship',
    price: 7399,
    compare_price: 11999,
    sku: 'CU-NL-001',
    category_id: '2',
    tags: ['rose-gold', 'necklace', 'luxury', 'elegant'],
    status: 'active',
    featured: true,
    weight: 12,
    seo_title: 'Rose Gold Pretty Woman Necklace - Luxury Jewelry',
    seo_description: 'Shop our exquisite rose gold necklace featuring premium craftsmanship and timeless design.',
    images: [
      {
        id: '1',
        product_id: '1',
        cloudinary_public_id: 'demo-necklace-1',
        url: '/hero-jewelry.png',
        alt_text: 'Rose Gold Necklace Front View',
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        product_id: '1',
        cloudinary_public_id: 'demo-necklace-2',
        url: '/New Ring.jpeg',
        alt_text: 'Rose Gold Necklace Side View',
        sort_order: 1,
        is_primary: false,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        product_id: '1',
        cloudinary_public_id: 'demo-necklace-3',
        url: '/Untitled design (10).png',
        alt_text: 'Rose Gold Necklace Detail',
        sort_order: 2,
        is_primary: false,
        created_at: new Date().toISOString()
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  const addToCart = () => {
    toast({
      title: 'Added to Cart',
      description: `${product?.name} (${quantity}) has been added to your cart.`,
    })
  }

  const addToWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: `${product?.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    })
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.short_description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied',
        description: 'Product link has been copied to clipboard.',
      })
    }
  }

  if (loading) {
    return <ProductSkeleton />
  }

  if (error && !product) {
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

  if (!product) return null

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const rating = 4.8 // Mock rating
  const reviews = 156 // Mock reviews

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
              <Link href="/products" className="text-gray-600 hover:text-[#ff8fab]">
                Products
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-8 lg:gap-0">
            {/* Product Images */}
            <div className="lg:col-span-4 space-y-2 w-full max-w-none sm:max-w-md lg:max-w-xl mx-auto lg:mx-0 lg:pr-1 lg:pl-6">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md border border-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]?.url || primaryImage?.url || '/placeholder.svg'}
                    alt={product.images[selectedImage]?.alt_text || product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={addToWishlist}
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

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-2 left-2" style={{ marginTop: discount > 0 ? '32px' : '0' }}>
                    <Badge className="bg-yellow-500 text-white font-semibold px-2 py-1 text-xs rounded-md shadow-md">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-md transition-all duration-300 ${
                        selectedImage === index 
                          ? "ring-2 ring-[#ff8fab] ring-offset-1 shadow-md" 
                          : "ring-1 ring-gray-200 hover:ring-[#ff8fab]/60 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt_text || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:col-span-4 space-y-4 lg:space-y-6 lg:pl-1">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[#ff8fab] border-[#ff8fab] font-serif text-xs lg:text-sm">
                    {product.category?.name || 'Jewelry'}
                  </Badge>
                  {product.sku && (
                    <span className="text-xs lg:text-sm text-gray-500 font-serif">SKU: {product.sku}</span>
                  )}
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
                          star <= Math.floor(rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-base lg:text-lg font-semibold text-gray-900">{rating}</span>
                  </div>
                  <div className="h-3 lg:h-4 w-px bg-gray-300"></div>
                  <span className="text-gray-600 font-serif text-sm lg:text-base">({reviews} reviews)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 lg:p-4 space-y-2 border border-pink-100">
                <div className="flex items-center space-x-3">
                  <span className="text-xl lg:text-3xl font-bold text-gray-900 font-serif">₹{product.price.toLocaleString()}</span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-base lg:text-xl text-gray-500 line-through font-serif">
                      ₹{product.compare_price.toLocaleString()}
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
                <p className="text-gray-700 leading-relaxed font-serif text-sm lg:text-base">
                  {product.description || product.short_description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

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
                    <Button 
                      onClick={addToCart}
                      className="h-9 lg:h-11 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-serif text-sm lg:text-base"
                    >
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
                    onClick={shareProduct}
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

          {/* Product Information */}
          <div className="mt-6 lg:mt-8 space-y-4">
            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif flex items-center mb-3">
                  <Gem className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-[#ff8fab]" />
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Material:</span>
                      <span className="text-gray-700">Premium Metal</span>
                    </div>
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Weight:</span>
                        <span className="text-gray-700">{product.weight}g</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Care:</span>
                      <span className="text-gray-700">Store in dry place</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Warranty:</span>
                      <span className="text-gray-700">Lifetime</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Origin:</span>
                      <span className="text-gray-700">Handcrafted</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Certification:</span>
                      <span className="text-gray-700">Hallmarked</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">Customer Reviews</h3>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-base font-semibold">{rating}</span>
                    <span className="text-gray-500 text-sm">({reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
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
                    }
                  ].map((review, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#ff8fab] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{review.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.name}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-pink-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}