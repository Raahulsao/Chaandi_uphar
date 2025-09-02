import { Shield, Truck, Award, HeartHandshake } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Every piece comes with our comprehensive lifetime warranty for your peace of mind.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders above ₹15,000 with secure packaging.",
  },
  {
    icon: Award,
    title: "Certified Quality",
    description: "All our jewelry is certified by leading gemological institutes for authenticity.",
  },
  {
    icon: HeartHandshake,
    title: "30-Day Returns",
    description: "Not completely satisfied? Return within 30 days for a full refund, no questions asked.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose Luxe</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're committed to providing you with an exceptional jewelry experience from selection to delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
