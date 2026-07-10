import Link from 'next/link'

export default function ProductCollections() {
  const collections = [
    {
      name: 'Heritage',
      icon: '🏛️',
      products: ['DivineVerse Ganesha', 'WonderCraft Taj Mahal'],
      comingSoon: false
    },
    {
      name: 'Gift',
      icon: '🎁',
      products: ['GlowFrame Photo Frame', 'StickerForge Sticker'],
      comingSoon: false
    },
    {
      name: 'Home',
      icon: '🏠',
      products: ['DeskCraft Pen Stand', 'AquaGrow Smart Pot'],
      comingSoon: false
    },
    {
      name: 'Kids',
      icon: '🧸',
      products: ['PlayVerse Toys', 'NameVerse Name Tag'],
      comingSoon: true
    },
    {
      name: 'Office',
      icon: '💼',
      products: ['DeskCraft Pen Stand', 'StickerForge Sticker'],
      comingSoon: false
    },
    {
      name: 'Engineering',
      icon: '⚙️',
      products: ['PrecisionCraft Parts', 'MechanicalModel'],
      comingSoon: true
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-16">Product Collections</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{collection.icon}</span>
                  <h3 className="text-2xl font-bold text-primary">{collection.name} Collection</h3>
                  {collection.comingSoon && (
                    <span className="ml-auto bg-accent text-white text-sm px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {collection.products.map((product, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-4"></span>
                      <span className="text-gray-700">{product}</span>
                    </li>
                  ))}
                </ul>

                {collection.comingSoon && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/products"
                      className="text-accent hover:text-red-800 font-medium"
                    >
                      View Products →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}