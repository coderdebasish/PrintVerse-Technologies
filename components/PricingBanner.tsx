export default function PricingBanner() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ribbon Badge */}
          <div className="inline-block bg-accent text-white px-8 py-3 rounded-full mb-8 font-bold text-lg shadow-md">
            One Company • One Price
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Just ₹4 per gram for all 3D printed products (50g and above)
          </h2>

          <div className="bg-gold text-white p-8 rounded-xl inline-block mb-10 shadow-lg">
            <p className="text-3xl md:text-4xl font-bold">50g Product = ₹200</p>
          </div>

          <p className="text-gray-600 text-lg">
            Note: Products below 50g charged as minimum 50g
          </p>
        </div>
      </div>
    </section>
  )
}