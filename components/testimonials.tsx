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
    image: "/young-indian-woman-headshot.png",
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

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="md:grid md:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Mobile horizontal scroll container */}
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:hidden scrollbar-none">
            <style jsx>{`
              .scrollbar-none {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0 w-[280px] snap-start">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <div className="relative mb-4">
                    <Quote className="absolute -top-1 -left-1 w-6 h-6 text-accent/20" />
                    <p className="text-muted-foreground leading-relaxed pl-4 text-sm">{testimonial.text}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Desktop grid layout */}
          <div className="hidden md:contents">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/20" />
                    <p className="text-muted-foreground leading-relaxed pl-6">{testimonial.text}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
