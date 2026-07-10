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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4 flex justify-center">
                  {product.icon}
                </div>
                <h3 className="font-bold text-primary mb-2">{product.name}</h3>
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