"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Crown, Sparkles, Shield, Truck, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const cartItems = [
  {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    price: 7399,
    originalPrice: 11999,
    quantity: 1,
    image: "/rose-gold-pretty-woman-necklace.png",
    category: "Necklaces"
  },
  {
    id: "2",
    name: "Golden Floral Moon Mangalsutra",
    price: 2999,
    originalPrice: 4599,
    quantity: 2,
    image: "/golden-floral-moon-mangalsutra.png",
    category: "Mangalsutra"
  },
  {
    id: "3",
    name: "Silver Stay With Me Ring",
    price: 1699,
    originalPrice: 2399,
    quantity: 1,
    image: "/silver-stay-with-me-ring.png",
    category: "Rings"
  },
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter((item) => item.id !== id))
    } else {
      setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = originalTotal - subtotal
  const shipping = subtotal > 5000 ? 0 : 199
  const total = subtotal + shipping

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
                <span className="text-gray-900 font-medium">Shopping Cart</span>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#ff8fab] to-purple-400 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif mb-4">Your cart is empty</h1>
              <p className="text-gray-600 font-serif mb-8">Discover our exquisite jewelry collection and add your favorite pieces to cart.</p>
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
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif flex items-center">
              <ShoppingBag className="w-6 lg:w-8 h-6 lg:h-8 mr-2 text-[#ff8fab]" />
              Shopping Cart ({items.length} items)
            </h1>
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <div className="text-sm text-gray-600 font-serif">
                You save ₹{savings.toLocaleString()} today!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 lg:space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg lg:rounded-2xl p-3 lg:p-6 shadow-md lg:shadow-lg border border-gray-100">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <Image 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name} 
                        fill 
                        className="object-contain" 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <p className="text-xs text-[#ff8fab] font-serif font-semibold">{item.category}</p>
                          <h3 className="font-bold text-gray-900 font-serif text-sm lg:text-base line-clamp-2 mb-2">{item.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-[#ff8fab] font-serif text-base lg:text-lg">₹{item.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through font-serif">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold w-fit">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                        
                        {/* Mobile quantity and remove controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0 hover:bg-[#ff8fab]/10 hover:text-[#ff8fab]"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-bold text-gray-900 font-serif text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0 hover:bg-[#ff8fab]/10 hover:text-[#ff8fab]"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 w-7 h-7 p-0"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping */}
              <div className="text-center py-4 lg:py-6">
                <Link href="/">
                  <Button variant="outline" className="border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif px-4 lg:px-6 text-sm lg:text-base">
                    <Crown className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 lg:space-y-6 lg:sticky lg:top-20 self-start">
              <div className="bg-white rounded-lg lg:rounded-2xl p-4 lg:p-6 shadow-md lg:shadow-lg border border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 font-serif mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-[#ff8fab]" />
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm font-serif">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      You Save
                    </span>
                    <span className="font-semibold">-₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-gray-600">
                      <Truck className="w-4 h-4 mr-1" />
                      Shipping
                    </span>
                    <span className={`font-semibold ${
                      shipping === 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-base lg:text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-[#ff8fab]">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-6 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="font-serif text-sm"
                    />
                    <Button variant="outline" className="border-[#ff8fab] text-[#ff8fab] hover:bg-[#ff8fab] hover:text-white font-serif whitespace-nowrap text-sm px-3 lg:px-4">
                      Apply
                    </Button>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white font-serif py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm lg:text-base">
                      <Shield className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Indicators - Hidden on mobile to save space */}
              <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 font-serif mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#ff8fab]" />
                  Your Benefits
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-[#ff8fab]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 font-serif text-sm">Free shipping on orders above ₹5,000</p>
                      <p className="text-xs text-gray-600">Your order qualifies!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#ff8fab]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 font-serif text-sm">Secure checkout</p>
                      <p className="text-xs text-gray-600">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ff8fab]/10 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-[#ff8fab]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 font-serif text-sm">Easy returns</p>
                      <p className="text-xs text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile trust indicators - Compact version */}
              <div className="lg:hidden bg-white rounded-lg p-4 shadow-md border border-gray-100">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="w-5 h-5 text-[#ff8fab] mb-1" />
                    <span className="text-xs font-semibold text-gray-900">Free Ship</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="w-5 h-5 text-[#ff8fab] mb-1" />
                    <span className="text-xs font-semibold text-gray-900">Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Award className="w-5 h-5 text-[#ff8fab] mb-1" />
                    <span className="text-xs font-semibold text-gray-900">Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
