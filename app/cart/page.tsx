"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const cartItems = [
  {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    price: 7399,
    originalPrice: 11999,
    quantity: 1,
    image: "/placeholder.svg?height=200&width=200&text=Rose+Gold+Necklace",
  },
  {
    id: "2",
    name: "Golden Floral Moon Mangalsutra",
    price: 2999,
    originalPrice: 4599,
    quantity: 2,
    image: "/placeholder.svg?height=200&width=200&text=Golden+Mangalsutra",
  },
  {
    id: "3",
    name: "Silver Stay With Me Ring",
    price: 1699,
    originalPrice: 2399,
    quantity: 1,
    image: "/placeholder.svg?height=200&width=200&text=Silver+Ring",
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
      <div className="min-h-screen bg-background">
        <main className="pt-10 lg:pt-14">
          <div className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
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
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-white">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6 lg:sticky lg:top-20 self-start">
              <div className="border border-border rounded-xl p-6 bg-white">
                <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full rounded-lg">Proceed to Checkout</Button>
                  </Link>
                </div>
              </div>

              <div className="text-center text-xs md:text-sm text-muted-foreground">
                <p>Free shipping on orders above ₹5,000</p>
                <p className="mt-2">🔒 Secure checkout with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
