import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-br from-primary to-blue-800">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in">
          Where Every Idea Takes Shape
        </h1>

        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto animate-slide-up">
          Your Imagination • Our Technology • Infinite Possibilities
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/quote"
            className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-800 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Request a Quote
          </Link>
          <Link
            href="/track"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </section>
  )
}