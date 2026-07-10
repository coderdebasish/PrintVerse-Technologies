import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PricingBanner from '@/components/PricingBanner'
import ProductCollections from '@/components/ProductCollections'
import FeaturedProducts from '@/components/FeaturedProducts'
import WhyChoosePrintVerse from '@/components/WhyChoosePrintVerse'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <HeroSection />
        <PricingBanner />
        <ProductCollections />
        <FeaturedProducts />
        <WhyChoosePrintVerse />
      </main>

      <Footer />
    </div>
  )
}