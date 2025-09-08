"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Product Card Component with hover effect
function ProductCard({ product }: { product: any }) {
  const [currentImage, setCurrentImage] = useState(product.image);

  const handleMouseEnter = () => {
    if (product.hoverImage) {
      setCurrentImage(product.hoverImage);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(product.image);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full">
      <div
        className="relative aspect-square"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/product/${product.id}`} className="block relative overflow-hidden w-full h-full">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          />
        </Link>
      </div>

      <div className="p-2.5 md:p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2 text-xs md:text-sm">
          <Star className="w-3 h-3 md:w-4 md:h-4 fill-current text-yellow-500" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-500">| {product.reviews}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm md:text-lg font-bold text-gray-900">{product.price}</span>
          {product.originalPrice && <span className="text-xs md:text-sm text-gray-500 line-through">{product.originalPrice}</span>}
        </div>

        <h3 className="font-medium text-gray-800 mb-3 md:mb-4 line-clamp-2 flex-1 text-xs md:text-base leading-tight">{product.name}</h3>

        <div className="flex flex-col gap-2 mt-auto">
          <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md text-xs md:text-sm py-2 h-auto font-medium" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CategoryPage({ title }: { title: string }) {
  const all = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    name: `${title} Design ${i + 1}`,
    price: "₹2,399",
    originalPrice: "₹3,799",
    image: i % 3 === 0 ? "/hero-jewelry.png" : i % 3 === 1 ? "/Untitled design (1).png" : "/Untitled design (2) (1).png",
    hoverImage: i % 3 === 0 ? "/New Ring.jpeg" : i % 3 === 1 ? "/Untitled design (10).png" : "/Untitled design (3) (1).png",
    rating: 4.7,
    reviews: 20 + i,
  }))

  const [visible, setVisible] = useState(8)

  return (
    <section className="py-6 md:py-8 lg:py-10 bg-white">
      <div className="container mx-auto px-3 md:px-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-4 md:mb-6">{title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-6">
          {all.slice(0, visible).map((p) => (
            <ProductCard key={p.id} product={p} />
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
