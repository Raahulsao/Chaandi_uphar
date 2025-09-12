"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"
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
        <Link href={`/product/${product.slug}`} className="block relative overflow-hidden w-full h-full">
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
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [visible, setVisible] = useState(8)

  // Map category names to category IDs for API calls
  const categoryMap: Record<string, string> = {
    'Rings': '550e8400-e29b-41d4-a716-446655440006',
    'Necklaces': '550e8400-e29b-41d4-a716-446655440001', 
    'Earrings': '550e8400-e29b-41d4-a716-446655440005',
    'Bracelets': '550e8400-e29b-41d4-a716-446655440007',
    'Bracelet': '550e8400-e29b-41d4-a716-446655440007',
    'Pendants': '550e8400-e29b-41d4-a716-446655440004',
    'Chains': '550e8400-e29b-41d4-a716-446655440003',
    'Silver': '550e8400-e29b-41d4-a716-446655440002',
    'Anklets': '550e8400-e29b-41d4-a716-446655440010', // Now maps to dedicated Anklets category
    'Gifts': '550e8400-e29b-41d4-a716-446655440009',
    'Jewelry': '550e8400-e29b-41d4-a716-446655440001',
    'Jewellery': '550e8400-e29b-41d4-a716-446655440001',
    'Couple Goals': '550e8400-e29b-41d4-a716-446655440008',
    'Ladoo Gopal Shringaar': '550e8400-e29b-41d4-a716-446655440011' // Now maps to dedicated Ladoo Gopal Shringaar category
  }

  // Fetch real products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const categoryId = categoryMap[title]
        const params = new URLSearchParams()
        
        if (categoryId && categoryId !== 'all') {
          params.append('category', categoryId)
        }
        params.append('limit', '50')
        params.append('status', 'active')

        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: 'no-store' // Ensure fresh data
        })
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
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    
    // Set up interval to refresh products every 30 seconds to catch new additions
    const interval = setInterval(fetchProducts, 30000)
    
    return () => clearInterval(interval)
  }, [title])

  return (
    <section className="py-6 md:py-8 lg:py-10 bg-white">
      <div className="container mx-auto px-3 md:px-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-4 md:mb-6">{title}</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-6 mt-8 md:mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-6 mt-8 md:mt-10">
              {products.slice(0, visible).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {visible < products.length && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setVisible((v) => Math.min(v + 8, products.length))}
                  className="px-8 bg-[#ff8fab] hover:bg-[#ff7a9a] text-white rounded-md"
                >
                  View More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No {title} Available</h3>
              <p className="text-gray-500 mb-6">
                We're currently updating our {title.toLowerCase()} collection. Please check back soon or browse our other categories.
              </p>
              <Link href="/">
                <Button className="bg-[#ff8fab] hover:bg-[#ff7a9a] text-white">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
