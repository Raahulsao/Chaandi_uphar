"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: "1",
    name: "Rose Gold Pretty Woman Necklace",
    image: "/luxury-diamond-ring.png",
    href: "/rings",
    originalPrice: "₹11,999",
    price: "₹7,399",
    rating: 4.8,
    reviews: 9,
    couponText: "Get it for ₹5,919 with coupon",
  },
  {
    id: "2",
    name: "Golden Floral Moon Mangalsutra",
    image: "/gold-necklace-pendant.png",
    href: "/necklaces",
    originalPrice: "₹4,599",
    price: "₹2,999",
    rating: 4.8,
    reviews: 32,
    couponText: "",
  },
  {
    id: "3",
    name: "Silver Stay With Me Ring",
    image: "/placeholder-4hg61.png",
    href: "/earrings",
    originalPrice: "₹2,399",
    price: "₹1,699",
    rating: 4.8,
    reviews: 54,
    couponText: "",
  },
  {
    id: "4",
    name: "Silver Mahabali Hanuman Pendant",
    image: "/placeholder-8ys4k.png",
    href: "/bracelets",
    originalPrice: "₹5,599",
    price: "₹3,499",
    rating: 4.7,
    reviews: 47,
    couponText: "Get it for ₹2,974 with coupon",
  },
  {
    id: "5",
    name: "Silver Deer Heart Pendant",
    image: "/luxury-jewelry-collection.png",
    href: "/collections",
    originalPrice: "₹2,999",
    price: "₹1,999",
    rating: 5.0,
    reviews: 20,
    couponText: "",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Most Gifted</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="group">
              <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card relative">
                <CardContent className="p-0">
                  <div className="absolute top-3 right-3 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 bg-white/80 hover:bg-white"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4 text-secondary" />
                    </Button>
                  </div>

                  <Link
                    href={`/product/${category.id}`}
                    className="block relative aspect-square overflow-hidden bg-muted"
                  >
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                    />
                    <img
                      src={(category.image || "").replace(/(\.[a-z]+)$/i, "-alt$1")}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <div className="absolute left-3 bottom-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border px-2 py-1 text-xs text-foreground shadow-sm">
                        <span className="font-medium">{category.rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-muted-foreground">| {category.reviews}</span>
                      </span>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-foreground">{category.price}</span>
                      <span className="text-sm text-muted-foreground line-through">{category.originalPrice}</span>
                    </div>

                    <Link href={`/product/${category.id}`}>
                      <h3 className="font-medium text-sm text-foreground mb-3 line-clamp-2 hover:text-secondary cursor-pointer transition-colors">
                        {category.name}
                      </h3>
                    </Link>

                    {category.couponText && (
                      <p className="text-xs text-secondary font-medium mb-3">{category.couponText}</p>
                    )}

                    <Button
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-md"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/collections"
            className="inline-flex items-center justify-center rounded-md px-6 py-2 bg-[#ff8fab] text-white hover:bg-[#ff7a9a] transition"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  )
}
