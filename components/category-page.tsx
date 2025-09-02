"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

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
            <div key={p.id} className="flex flex-col bg-white">
              <div className="relative">
                <Link href={`/product/${p.id}`} className="block relative aspect-square overflow-hidden">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>

              <div className="p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">{p.price}</span>
                  {p.originalPrice && <span className="text-sm text-gray-500 line-through">{p.originalPrice}</span>}
                </div>

                <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 flex-1 text-base">{p.name}</h3>

                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md" size="sm">
                    Add to Cart
                  </Button>
                  <Link
                    href={`/product/${p.id}`}
                    className="text-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-2 flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{p.rating}</span>
                  <span className="text-gray-500">({p.reviews})</span>
                </div>
              </div>
            </div>
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
