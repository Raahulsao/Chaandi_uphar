"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useState } from "react";

type Product = {
  id: string
  title: string
  price: string
  mrp?: string
  rating?: number
  reviews?: number
  image: string
  hoverImage?: string // Added for hover effect
  imageAlt?: string
  href?: string
  badge?: string
  couponText?: string
}

export function ProductListing({
  title,
  products: initialProducts, // Renamed to avoid conflict with local products array
  className,
}: {
  title: string
  products: Product[]
  className?: string
}) {
  const products = initialProducts.map(p => ({
    ...p,
    hoverImage: p.hoverImage || (p.id === "1" ? "/New Ring.jpeg" : p.id === "2" ? "/Untitled design (10).png" : p.id === "3" ? "/Untitled design (3) (1).png" : "/placeholder.svg"),
    image: p.image || (p.id === "1" ? "/hero-jewelry.png" : p.id === "2" ? "/Untitled design (1).png" : p.id === "3" ? "/Untitled design (2) (1).png" : "/placeholder.svg"),
  }));

  return (
    <section className={cn("container mx-auto px-3 md:px-4 py-6 md:py-8", className)}>
      <h2 className="text-xl md:text-3xl font-semibold tracking-tight mb-4 md:mb-6 text-foreground">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
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
        <Link href={product.href || "#"} className="block relative overflow-hidden w-full h-full">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          />
        </Link>
      </div>

      <div className="p-2.5 md:p-4 flex flex-col flex-grow">
        {(product.rating !== undefined || product.reviews !== undefined) && (
          <div className="flex items-center gap-1 mb-2 text-xs md:text-sm">
            <Star className="w-3 h-3 md:w-4 md:h-4 fill-current text-yellow-500" />
            <span className="font-medium text-gray-700">{product.rating?.toFixed(1) ?? "4.7"}</span>
            <span className="text-gray-500">| {product.reviews ?? 20}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm md:text-base font-bold text-gray-900">{product.price}</span>
          {product.mrp && <span className="text-xs md:text-sm text-gray-500 line-through">{product.mrp}</span>}
        </div>

        <h3 className="font-medium text-gray-800 mb-3 md:mb-4 line-clamp-2 flex-1 text-xs md:text-sm leading-tight">{product.title}</h3>

        <div className="flex flex-col gap-2 mt-auto">
          <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md text-xs md:text-sm py-2 h-auto font-medium" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
