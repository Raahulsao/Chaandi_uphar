"use client"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react";

const products = [
  {id:"1",name:"Rose Gold Pretty Woman Necklace",price:"₹7,399",originalPrice:"₹11,999",image:"/placeholder.svg",rating:4.8,reviews:156},
  {id:"2",name:"Silver Mahabali Hanuman Pendant",price:"₹3,499",originalPrice:"₹5,299",image:"/placeholder.svg",rating:4.7,reviews:89},
  {id:"3",name:"Diamond Eternity Ring",price:"₹12,999",originalPrice:"₹18,999",image:"/placeholder.svg",rating:4.9,reviews:234},
  {id:"4",name:"Pearl Drop Earrings",price:"₹4,999",originalPrice:"₹7,999",image:"/placeholder.svg",rating:4.6,reviews:167}
]

export function BestSellers() {
  const products = [
    {
      id: "1",
      name: "Diamond Rose Gold Ring",
      price: "₹2,399",
      originalPrice: "₹3,799",
      image: "/hero-jewelry.png",
      hoverImage: "/New Ring.jpeg", // Added for hover effect
      rating: 4.7,
      reviews: 20,
    },
    {
      id: "2",
      name: "Elegant Gold Chain",
      price: "₹1,899",
      originalPrice: "₹2,999",
      image: "/Untitled design (1).png",
      hoverImage: "/Untitled design (10).png", // Added for hover effect
      rating: 4.5,
      reviews: 15,
    },
    {
      id: "3",
      name: "Classic Silver Earrings",
      price: "₹999",
      originalPrice: "₹1,599",
      image: "/Untitled design (2) (1).png",
      hoverImage: "/Untitled design (3) (1).png", // Added for hover effect
      rating: 4.8,
      reviews: 25,
    },
    {
      id: "4",
      name: "Pearl Necklace Set",
      price: "₹3,499",
      originalPrice: "₹5,000",
      image: "/hero-jewelry.png",
      hoverImage: "/New Ring.jpeg", // Added for hover effect
      rating: 4.6,
      reviews: 18,
    },
  ];

  return (
    <section className="py-8 lg:py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-foreground text-center">Most Gifted</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: typeof products[0] }) {
  const [currentImage, setCurrentImage] = useState(product.image);

  const handleMouseEnter = () => {
    if ('hoverImage' in product && product.hoverImage) {
      setCurrentImage(product.hoverImage as string);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(product.image);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-300">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">{product.price}</span>
          {product.originalPrice && <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>}
        </div>

        <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 flex-1 text-base">{product.name}</h3>

        <div className="flex flex-col gap-2">
          <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md" size="sm">
            Add to Cart
          </Button>
          <Link href={`/product/${product.id}`} className="text-center text-sm text-pink-600 hover:text-pink-800 mb-2 border border-pink-600 rounded-md py-1">View Details</Link>
        </div>

        <div className="mt-2 flex items-center gap-1 text-sm text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span>{product.rating}</span>
          <span className="text-gray-500">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}
