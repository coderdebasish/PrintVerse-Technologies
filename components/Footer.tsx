export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PrintVerse Technologies</h3>
            <p className="text-blue-100 mb-4">Where Every Idea Takes Shape</p>
            <p className="text-blue-200 text-sm">
              Powered by IIFR Lab, IEM Kolkata
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="/quote" className="hover:text-white transition-colors">Request Quote</a></li>
              <li><a href="/track" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Mentors</h4>
            <ul className="space-y-1 text-blue-100 text-sm">
              <li>Mr. Diptiman Dasgupta</li>
              <li>Dr. Prabir Kumar Das</li>
              <li>Dr. Chandan Adhikari</li>
              <li>Dr. Ranabir Banik</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">FB</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">IG</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">TW</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">YT</a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-8 text-center text-blue-200 text-sm">
          <p>© {new Date().getFullYear()} PrintVerse Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}