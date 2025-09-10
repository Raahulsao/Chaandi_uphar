"use client"
import Link from "next/link"

const categories = [
  {
    name: "Pendants",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center",
    href: "/pendants",
  },
  {
    name: "Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop&crop=center",
    href: "/earrings",
  },
  {
    name: "Rings",
    image: "/hero-jewelry.png",
    href: "/rings",
  },
  {
    name: "Chains",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
    href: "/chains",
  },
  {
    name: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop&crop=center",
    href: "/bracelet",
  },
  {
    name: "Silver",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center",
    href: "/silver",
  },
  {
    name: "Couple Goals",
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=200&h=200&fit=crop&crop=center",
    href: "/couple-goals",
  },
  {
    name: "Anklets",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center",
    href: "/anklets",
  },
  {
    name: "Ladoo Gopal Shringaar",
    image: "/ladoo-gopal-shringaar.png",
    href: "/ladoo-gopal-shringaar",
  },
  {
    name: "Gifts",
    image: "/gift-items.png",
    href: "/gifts",
  },
] as const

export function CategorySection() {
  return (
    <section className="pt-1 pb-2 md:pt-1 md:pb-6 lg:pt-22 lg:pb-8 bg-white relative w-full">
      <div className="w-full px-3 md:px-8 relative">
        <div
          className="flex overflow-x-auto gap-3 md:gap-4 pb-2 no-scrollbar scroll-smooth"
          role="region"
          aria-label="Browse categories"
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center space-y-1 md:space-y-2 flex-shrink-0"
            >
              <div className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden transition-transform duration-300 shadow-sm bg-[rgba(255,143,171,1)] border border-[rgba(255,143,171,1)] group-hover:scale-105 w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32">
                <img
                  src={category.image || "/placeholder.svg?height=200&width=200&query=jewellery"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs md:text-base font-medium text-gray-800 text-center group-hover:text-[#ff8fab] transition-colors leading-tight whitespace-nowrap max-w-[100px] md:max-w-[120px] overflow-hidden text-ellipsis">
                {category.name}
              </span>
            </Link>
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
