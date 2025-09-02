"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

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
          <article
            key={p.id}
            className="group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#ff8fab]/30"
          >
            <div className="relative">
              <Link href={p.href || "#"} className="block relative aspect-square overflow-hidden bg-muted">
                {/* Primary image (kept visible; subtle zoom) */}
                <img
                  src={p.image || "/placeholder.svg"}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                />
                {/* Alt image (fades in on hover/focus/active). Hidden if it fails to load. */}
                <img
                  src={
                    p.imageAlt ? p.imageAlt : p.image ? p.image.replace(/(\.[a-z]+)$/i, "-alt$1") : "/placeholder.svg"
                  }
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </Link>

              {/* rating pill */}
              {(p.rating !== undefined || p.reviews !== undefined) && (
                <div className="absolute left-3 bottom-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow-sm border">
                    <span className="text-yellow-500">★</span>
                    {p.rating?.toFixed(1) ?? "4.7"} <span className="text-muted-foreground">|</span> {p.reviews ?? 20}
                  </span>
                </div>
              )}

              {/* wishlist placeholder (top-right) */}
              <button
                aria-label="Save to wishlist"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border shadow-sm"
              >
                <span className="text-[#ff8fab]">♡</span>
              </button>

              {p.badge && (
                <div className="absolute left-0 top-3">
                  <span className="rounded-r-md bg-[#ff8fab] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {p.badge}
                  </span>
                </div>
              )}
            </div>

            {/* details */}
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                <div className="text-xl font-semibold text-foreground">{p.price}</div>
                {p.mrp && <div className="text-muted-foreground line-through">{p.mrp}</div>}
              </div>
              <h3 className="mt-2 text-base font-medium text-foreground/90 line-clamp-2">{p.title}</h3>
              {p.couponText && <p className="mt-2 text-sm text-[#ff8fab]">{p.couponText}</p>}

              <div className="mt-4">
                <Link
                  href={p.href || "#"}
                  className="block w-full rounded-md bg-[#ff8fab] px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
