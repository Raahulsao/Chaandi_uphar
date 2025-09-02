"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

type Product = {
  id: string
  title: string
  price: string
  mrp?: string
  rating?: number
  reviews?: number
  image: string
  imageAlt?: string
  href?: string
  badge?: string
  couponText?: string
}

export function ProductListing({
  title,
  products,
  className,
}: {
  title: string
  products: Product[]
  className?: string
}) {
  return (
    <section className={cn("container mx-auto px-4 py-8", className)}>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-foreground">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="flex flex-col bg-white">
            <div className="relative">
              <Link href={p.href || "#"} className="block relative aspect-square overflow-hidden">
                <img
                  src={p.image || "/placeholder.svg"}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>

            <div className="p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">{p.price}</span>
                {p.mrp && <span className="text-sm text-gray-500 line-through">{p.mrp}</span>}
              </div>

              <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 flex-1 text-base">{p.title}</h3>

              <div className="flex flex-col gap-2">
                <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md" size="sm">
                  Add to Cart
                </Button>
                <Link
                  href={p.href || "#"}
                  className="text-center text-sm text-gray-600 hover:text-gray-800"
                >
                  View Details
                </Link>
              </div>

              {(p.rating !== undefined || p.reviews !== undefined) && (
                <div className="mt-2 flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{p.rating?.toFixed(1) ?? "4.7"}</span>
                  <span className="text-gray-500">({p.reviews ?? 20})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
