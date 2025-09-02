"use client"

import Link from "next/link"
import { Gift } from "lucide-react"

const tiers = [
  { label: "Under", price: "₹999", href: "/all?maxPrice=999" },
  { label: "Under", price: "₹2999", href: "/all?maxPrice=2999" },
  { label: "Under", price: "₹4999", href: "/all?maxPrice=4999" },
  { label: "Premium", price: "Gifts", href: "/gifts", isGift: true },
]

export default function ShopByPrice() {
  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="mx-auto w-[80%]">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-5">Shop By Price</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {tiers.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-label={`${t.label} ${t.price}`}
              className={[
                "group relative rounded-3xl border shadow-sm transition hover:shadow-md overflow-hidden",
                "aspect-square min-h-[120px] md:min-h-[160px]",
                t.isGift
                  ? "border-pink-300 bg-[linear-gradient(180deg,#ff4c78_0%,#ff3f6c_100%)]"
                  : "border-pink-100 bg-[linear-gradient(180deg,#ffe4ec_0%,#fff1f5_100%)]",
              ].join(" ")}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-5">
                <span
                  className={t.isGift ? "text-white/90 text-sm md:text-base" : "text-neutral-700 text-sm md:text-base"}
                >
                  {t.label}
                </span>
                <span
                  className={[
                    "mt-1 text-2xl md:text-3xl font-extrabold",
                    t.isGift ? "text-white" : "text-[#ff8fab]",
                  ].join(" ")}
                >
                  {t.price}
                </span>

                <span
                  className={[
                    "mt-3 inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full transition-transform group-hover:scale-105",
                    t.isGift ? "bg-white text-[#ff3f6c]" : "bg-[#ff8fab] text-white",
                  ].join(" ")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M8 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {t.isGift && (
                <div className="absolute top-0 right-0">
                  <div className="relative w-14 h-14 md:w-16 md:h-16">
                    <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] md:border-t-[64px] border-t-[#c71f4a] border-l-[56px] md:border-l-[64px] border-l-transparent" />
                    <Gift className="absolute right-2 top-2 h-4 w-4 md:h-5 md:w-5 text-white" aria-hidden="true" />
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
