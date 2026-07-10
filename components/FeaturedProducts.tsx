import Link from 'next/link'

export default function FeaturedProducts() {
  const products = [
    { name: 'DivineVerse Ganesha', icon: '🏛️' },
    { name: 'GlowFrame Photo Frame', icon: '🖼️' },
    { name: 'DeskCraft Pen Stand', icon: '✏️' },
    { name: 'WonderCraft Taj Mahal', icon: '🏰' },
    { name: 'PlayVerse Toys', icon: '🧸' },
    { name: 'NameVerse Name Tag', icon: '📛' },
    { name: 'StickerForge Sticker', icon: '🏷️' },
    { name: 'AquaGrow Smart Pot', icon: '🌱' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-16">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-8 text-center">
                <div className="text-5xl mb-6 flex justify-center">
                  {product.icon}
                </div>
                <h3 className="font-bold text-primary mb-4 text-lg">{product.name}</h3>
                <Link
                  href="/products"
                  className="text-accent hover:text-red-800 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}