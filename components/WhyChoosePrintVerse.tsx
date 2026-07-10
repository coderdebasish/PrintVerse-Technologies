export default function WhyChoosePrintVerse() {
  const features = [
    {
      icon: '🔄',
      title: '100% Customized',
      description: 'Every product is tailor-made to your specifications'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'High-grade materials for exceptional results'
    },
    {
      icon: '🎨',
      title: 'Multiple Colors & Materials',
      description: 'Choose from various options to match your vision'
    },
    {
      icon: '⏱️',
      title: 'Fast Turnaround',
      description: 'Quick production times without compromising quality'
    },
    {
      icon: '💰',
      title: 'Affordable Pricing',
      description: 'Competitive rates for all your 3D printing needs'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-blue-900">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose PrintVerse</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-opacity-20 transition-all"
            >
              <div className="text-4xl mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}