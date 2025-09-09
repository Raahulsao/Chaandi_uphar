"use client"

import { Card, CardContent } from "@/components/ui/card"

const collections = [
  {
    name: "Eternal Elegance",
    image: "/Untitled design (14).png",
  },
  {
    name: "Silver Collection",
    image: "/Untitled design (14).png",
  },
  {
    name: "Modern Minimal",
    image: "silver collection 2.jpg",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Featured Collections</h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Discover our signature collections, each telling a unique story through exceptional craftsmanship
          </p>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:grid md:grid-cols-3 no-scrollbar scroll-smooth">
          {collections.map((collection) => (
            <Card
              key={collection.name}
              className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[280px] md:w-auto"
            >
              <CardContent className="p-0">
                <div className="relative w-full aspect-square overflow-hidden rounded-xl border-2 border-[rgba(255,143,171,1)]">
                  <img
                    src={
                      collection.image ||
                      "/placeholder.svg?height=380&width=640&query=high-end%20jewelry%20collection" ||
                      "/placeholder.svg"
                    }
                    alt={collection.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
