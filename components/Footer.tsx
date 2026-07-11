export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">PrintVerse Technologies</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">Where Every Idea Takes Shape</p>
            <p className="text-blue-200 text-sm">
              Powered by IIFR Lab, IEM Kolkata
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-blue-100">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="/request-quote" className="hover:text-white transition-colors">Request Quote</a></li>
              <li><a href="/track" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Mentors</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>Mr. Diptiman Dasgupta</li>
              <li>Dr. Prabir Kumar Das</li>
              <li>Dr. Chandan Adhikari</li>
              <li>Dr. Ranabir Banik</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-xl">FB</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-xl">IG</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-xl">TW</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-xl">YT</a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-12 text-center text-blue-200 text-sm">
          <p>© {new Date().getFullYear()} PrintVerse Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}