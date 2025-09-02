"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Rose Gold Drop Wreath Bracelet",
    price: "₹2,399",
    originalPrice: "₹3,799",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 9,
  },
  {
    id: 2,
    name: "Golden Glint Earrings",
    price: "₹1,999",
    originalPrice: "₹2,999",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 85,
  },
  {
    id: 3,
    name: "Silver Deer Heart in Red Necklace",
    price: "₹2,699",
    originalPrice: "₹3,999",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 37,
  },
  {
    id: 4,
    name: "Silver Deer Heart Zircon Necklace",
    price: "₹1,999",
    originalPrice: "₹2,999",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
    rating: 5.0,
    reviews: 21,
  },
  {
    id: 5,
    name: "Silver Evil Eye Bracelet",
    price: "₹1,499 - ₹2,899",
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 6,
    name: "Classic Pearl Pendant",
    price: "₹2,299",
    originalPrice: "₹3,199",
    image: "https://images.unsplash.com/photo-1617038260897-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 44,
  },
  {
    id: 7,
    name: "Minimal Gold Chain",
    price: "₹1,799",
    originalPrice: "₹2,499",
    image: "https://images.unsplash.com/photo-1520975916090-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 51,
  },
  {
    id: 8,
    name: "Crystal Stud Earrings",
    price: "₹1,299",
    originalPrice: "₹1,899",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 63,
  },
]

export function BestSellers() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Most Gifted</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our most loved pieces, chosen by customers who appreciate exceptional quality and timeless design
          </p>
        </div>

        <div
          className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] py-1"
          aria-label="Most gifted products"
          role="region"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col bg-white flex-none w-[75%] sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start"
            >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative overflow-hidden">
                  <div className="relative block aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg?height=400&width=400&query=jewellery%20product"}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                    />
                    <img
                      src={
                        (product.image || "/placeholder.svg?height=400&width=400&query=jewellery%20product") +
                        "&blur=0.001"
                      }
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border px-2 py-1 text-xs text-gray-700 shadow-sm">
                      <span className="font-medium">{product.rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-gray-500">| {product.reviews}</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-[#ff8fab]" />
                  </Button>
                </div>

                <div className="p-4 flex-1 flex flex-col opacity-100 border-none border-0 rounded-none shadow-none">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 flex-1 text-base">{product.name}</h3>

                  <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="default" size="lg" className="px-8 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white">
            View All Products
          </Button>
        </div>
      </div>
      <style jsx>{`
        section :global([aria-label="Most gifted products"]::-webkit-scrollbar) {
          display: none;
        }
      `}</style>
    </section>
  )
}
