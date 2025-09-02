"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import { useState } from "react"

export function CategoryPage({ title }: { title: string }) {
  const all = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    name: `${title} Design ${i + 1}`,
    price: "₹2,399",
    originalPrice: "₹3,799",
    image: "/hero-jewelry.png",
    rating: 4.7,
    reviews: 20 + i,
  }))

  const [visible, setVisible] = useState(8)

  return (
    <section className="py-8 lg:py-10 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">{title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {all.slice(0, visible).map((p) => (
            <Card key={p.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition h-full">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative aspect-square w-full overflow-hidden">
                  <a href={`/product/${p.id}`} className="block relative h-full w-full bg-muted">
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                    />
                    <img
                      src={(p.image || "").replace(/(\.[a-z]+)$/i, "-alt$1")}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </a>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border px-2 py-1 text-xs text-gray-700 shadow-sm">
                      <span className="font-medium">{p.rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-gray-500">| {p.reviews}</span>
                    </span>
                  </div>
                  <button
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white inline-flex h-8 w-8 items-center justify-center rounded-full border opacity-0 group-hover:opacity-100 transition"
                  >
                    <Heart className="w-4 h-4 text-[#ff8fab]" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">{p.price}</span>
                    {p.originalPrice && <span className="text-sm text-gray-500 line-through">{p.originalPrice}</span>}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 flex-1 text-base">{p.name}</h3>
                  <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visible < all.length && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setVisible((v) => Math.min(v + 8, all.length))}
              className="px-8 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md"
            >
              View More
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
