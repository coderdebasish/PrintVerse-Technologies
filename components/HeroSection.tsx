import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-blue-900">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Where Every Idea Takes Shape
        </h1>

        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Your Imagination • Our Technology • Infinite Possibilities
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/quote"
            className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-colors shadow-lg"
          >
            Request a Quote
          </Link>
          <Link
            href="/track"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-colors"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </section>
  )
}