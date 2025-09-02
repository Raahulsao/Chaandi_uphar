"use client"
import Link from "next/link"
import { useState } from "react"

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
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
    href: "/rings",
  },
  {
    name: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop&crop=center",
    href: "/bracelet",
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 7

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(categories.length / itemsPerView))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.ceil(categories.length / itemsPerView)) % Math.ceil(categories.length / itemsPerView),
    )
  }

  return (
    <section className="py-12 bg-white relative w-full">
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(categories.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full px-8 relative">
        <div
          className="no-scrollbar flex items-stretch justify-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-56 scroll-smooth flex-row mt-0 mb-0 ml-0 mr-0 pt-2 gap-3.5"
          role="region"
          aria-label="Browse categories"
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group shrink-0 snap-start w-[70%] xs:w-[55%] sm:w-[40%] md:w-[28%] lg:w-[14.285%] max-w-[220px] flex flex-col items-center space-y-4"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden transition-transform duration-300 shadow-sm bg-[rgba(255,143,171,1)] border border-[rgba(255,143,171,1)] group-hover:scale-105 w-40 h-40 gap-0">
                <img
                  src={category.image || "/placeholder.svg?height=200&width=200&query=jewellery"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-medium text-gray-800 text-center group-hover:text-[#ff8fab] transition-colors">
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
