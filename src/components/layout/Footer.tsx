import { Link } from 'react-router-dom'
import { Leaf, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="font-bold text-white text-lg">Campa Fertichem</span>
            </div>
            <p className="text-sm text-green-300 leading-relaxed">
              Quality fertilizer solutions for better crop nutrition. Serving farmers across India from Taloja, Navi Mumbai.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/about', 'About Us'], ['/products', 'Products'], ['/blog', 'Blog'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-green-300 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-green-300 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=PLANT GROWTH REGULATORS" className="text-green-300 hover:text-white transition-colors">Plant Growth Regulators</Link></li>
              <li><Link to="/products?category=NPK FORTIFIED LIQUID FERTILIZER" className="text-green-300 hover:text-white transition-colors">NPK Fortifiled Liquid Fertilizer</Link></li>
              <li><Link to="/products?category=MICRONUTRIENTS" className="text-green-300 hover:text-white transition-colors">Micronutrients</Link></li>
              <li><Link to="/products?category=BIO FERTILIZERS" className="text-green-300 hover:text-white transition-colors">Bio fertilizers</Link></li>
            <li><Link to="/products?category=NPK SPECIAL" className="text-green-300 hover:text-white transition-colors">NPK Special</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-green-300">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-green-400" />
                <span>CAMPA FERTICHEM 
                  B201 Devdrishti, Chs Plot No. 62,  Navade Phase
                  2,Taloja Navi Mumbai.
                  Email ID : campafertichem@gmail.com
                  Customer Care No. : +917276772958/9922160100
                  , Maharashtra, India</span>
              </li>
              <li>
                <a href="tel:+917276772958" className="flex items-center gap-2 text-green-300 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>+91 72767 72958</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@campafertichem.com" className="flex items-center gap-2 text-green-300 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-green-400" />
                  <span>info@campafertichem.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 text-center text-sm text-green-400">
          <p>© {new Date().getFullYear()} Campa Fertichem. All rights reserved.</p>
        </div>
      </div>
{/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917276772958?text=Hello%20Campa%20Fertichem"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300"
      >
        <svg
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824zM12.04 2c-5.523 0-10 4.477-10 10 0 1.772.463 3.498 1.343 5.023l-1.383 5.05 5.176-1.357c1.464.799 3.118 1.284 4.864 1.284 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.232c-1.574 0-3.111-.423-4.454-1.223l-.32-.191-3.308.868.883-3.224-.209-.333c-.88-1.4-1.344-3.033-1.344-4.708 0-4.808 3.913-8.721 8.722-8.721 4.809 0 8.721 3.913 8.721 8.721 0 4.809-3.912 8.721-8.722 8.721z" />
        </svg>
      </a>
    </footer>
  )
}
