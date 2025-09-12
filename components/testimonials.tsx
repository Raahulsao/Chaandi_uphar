"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The craftsmanship is absolutely stunning. My engagement ring exceeded all expectations, and the customer service was exceptional throughout the entire process.",
    image: "/indian-woman-headshot.png",
  },
  {
    name: "Arjun Patel",
    location: "Delhi",
    rating: 5,
    text: "Bought a necklace for my wife's anniversary. The quality is outstanding and the packaging was so elegant. She absolutely loves it!",
    image: "/members/nishant-singh-didawat.png",
  },
  {
    name: "Kavya Reddy",
    location: "Bangalore",
    rating: 5,
    text: "I've been a customer for over two years now. Every piece I've purchased has been perfect. The attention to detail is remarkable.",
    image: "/placeholder-user.jpg",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their experience
          </p>
        </div>

        {/* Horizontal scrollable layout */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar scroll-smooth">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0 w-[300px] md:w-[350px] lg:w-[400px]">
              <CardContent className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-1 mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-accent text-accent" />
                  ))}
                </div>
                <div className="relative mb-4 md:mb-6">
                  <Quote className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-6 h-6 md:w-8 md:h-8 text-accent/20" />
                  <p className="text-muted-foreground leading-relaxed pl-4 md:pl-6 text-sm md:text-base">{testimonial.text}</p>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.location}</p>
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
