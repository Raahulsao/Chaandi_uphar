"use client"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products?featured=true&limit=8&status=active')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            // Transform API data to match the expected format
            const transformedProducts = data.map((product: any) => ({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: `₹${product.price.toLocaleString()}`,
              originalPrice: product.compare_price ? `₹${product.compare_price.toLocaleString()}` : undefined,
              image: product.images?.[0]?.url || "/placeholder.svg",
              hoverImage: product.images?.[1]?.url || product.images?.[0]?.url || "/placeholder.svg",
              rating: 4.5 + Math.random() * 0.5, // Mock rating for now
              reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews for now
            }))
            setProducts(transformedProducts)
          } else {
            setProducts([])
          }
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="pt-2 pb-6 lg:py-8 bg-white">
      <div className="container mx-auto px-3 md:px-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-foreground text-center">Most Gifted</h2>
        
        {loading ? (
          <div className="flex overflow-x-auto gap-3 md:gap-6 pb-4 no-scrollbar scroll-smooth">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[calc(50vw-12px)] md:w-[calc(33.333vw-16px)] lg:w-[calc(25vw-18px)] animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 md:gap-6 pb-4 no-scrollbar scroll-smooth">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No featured products available at the moment.</p>
            <p className="text-sm text-gray-400">Add some products and mark them as featured in the admin panel.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}

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
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full flex-shrink-0 w-[calc(50vw-12px)] md:w-[calc(33.333vw-16px)] lg:w-[calc(25vw-18px)]">
      <div
        className="relative aspect-square"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/product/${product.slug}`} className="block relative overflow-hidden w-full h-full">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          />
        </Link>
      </div>

      <div className="p-2.5 md:p-4 flex flex-col min-h-[150px] md:min-h-[170px]">
        <div className="flex items-center gap-1 mb-2 text-xs md:text-sm">
          <Star className="w-3 h-3 md:w-4 md:h-4 fill-current text-yellow-500" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-500">| {product.reviews}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm md:text-lg font-bold text-gray-900">{product.price}</span>
          {product.originalPrice && <span className="text-xs md:text-sm text-gray-500 line-through">{product.originalPrice}</span>}
        </div>

        <h3 className="font-medium text-gray-800 mb-4 line-clamp-2 text-xs md:text-base leading-tight h-[32px] md:h-[40px]">{product.name}</h3>

        <div className="mt-auto">
          <Button className="w-full bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md text-xs md:text-sm py-2 h-auto font-medium" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
