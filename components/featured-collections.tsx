"use client"

import { Card, CardContent } from "@/components/ui/card"

const collections = [
  {
    name: "Eternal Elegance",
    image: "https://images.unsplash.com/photo-1612336307429-8b8b91753d16?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Celestial Dreams",
    image: "https://images.unsplash.com/photo-1610901341214-89c2b2ad9ce0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Modern Minimal",
    image: "https://images.unsplash.com/photo-1603575449299-0f52f4c9e3bd?q=80&w=1600&auto=format&fit=crop",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Collections</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our signature collections, each telling a unique story through exceptional craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch h-auto">
          {collections.map((collection) => (
            <Card
              key={collection.name}
              className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative w-full h-[320px] overflow-hidden rounded-xl border-2 border-[rgba(255,143,171,1)] md:h-[510px]">
                  <img
                    src={
                      collection.image ||
                      "/placeholder.svg?height=380&width=640&query=high-end%20jewelry%20collection" ||
                      "/placeholder.svg"
                    }
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const t = e.currentTarget
                      if (!t.src.includes("placeholder.svg")) {
                        t.src = "/placeholder.svg"
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
