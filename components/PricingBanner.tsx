export default function PricingBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ribbon Badge */}
          <div className="inline-block bg-accent text-white px-6 py-2 rounded-full mb-6 font-bold">
            One Company • One Price
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Just ₹4 per gram for all 3D printed products (50g and above)
          </h2>

          <div className="bg-gold text-white p-6 rounded-lg inline-block mb-8">
            <p className="text-xl md:text-2xl font-bold">50g Product = ₹200</p>
          </div>

          <p className="text-gray-600">
            Note: Products below 50g charged as minimum 50g
          </p>
        </div>
      </div>
    </section>
  )
}