import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/category-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { BestSellers } from "@/components/best-sellers"
import { Testimonials } from "@/components/testimonials"
import { WhyChooseUs } from "@/components/why-choose-us"
import ShopByPrice from "@/components/shop-by-price"
import PromoCollage1850 from "@/components/promo-collage"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellers />
      <ShopByPrice />
      <FeaturedCollections />
      <PromoCollage1850 />
      <Testimonials />
      <WhyChooseUs />
    </>
  )
}
