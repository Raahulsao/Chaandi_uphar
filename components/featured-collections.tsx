"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function FeaturedCollections() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories and products to create collections
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true)
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categories = await categoriesResponse.json()
        
        if (categories && categories.length > 0) {
          // Take first 3 categories and get a featured product image for each
          const collectionsPromises = categories.slice(0, 3).map(async (category: any) => {
            try {
              const productsResponse = await fetch(`/api/products?category=${category.id}&limit=1&status=active`)
              const products = await productsResponse.json()
              
              return {
                name: `${category.name} Collection`,
                image: products?.[0]?.images?.[0]?.url || "/placeholder.svg",
              }
            } catch {
              return {
                name: `${category.name} Collection`,
                image: "/placeholder.svg",
              }
            }
          })
          
          const resolvedCollections = await Promise.all(collectionsPromises)
          setCollections(resolvedCollections)
        } else {
          setCollections([])
        }
      } catch (error) {
        console.error('Error fetching collections:', error)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Featured Collections</h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Discover our signature collections, each telling a unique story through exceptional craftsmanship
          </p>
        </div>

        {loading ? (
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:grid md:grid-cols-3 no-scrollbar scroll-smooth">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] md:w-auto animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:grid md:grid-cols-3 no-scrollbar scroll-smooth">
            {collections.map((collection) => (
              <Card
                key={collection.name}
                className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[280px] md:w-auto"
              >
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square overflow-hidden rounded-xl border-2 border-[rgba(255,143,171,1)]">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget
                        if (!t.src.includes("placeholder.svg")) {
                          t.src = "/placeholder.svg"
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white text-sm md:text-lg lg:text-xl font-bold drop-shadow-lg">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No collections available at the moment.</p>
            <p className="text-sm text-gray-400">Collections will appear here when you add products to different categories.</p>
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
  )
}
