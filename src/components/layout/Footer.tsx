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
              <li><Link to="/products?category=nitrogen-fertilizers" className="text-green-300 hover:text-white transition-colors">Nitrogen Fertilizers</Link></li>
              <li><Link to="/products?category=phosphatic-fertilizers" className="text-green-300 hover:text-white transition-colors">Phosphatic Fertilizers</Link></li>
              <li><Link to="/products?category=potassic-fertilizers" className="text-green-300 hover:text-white transition-colors">Potassic Fertilizers</Link></li>
              <li><Link to="/products?category=micronutrients" className="text-green-300 hover:text-white transition-colors">Micronutrients</Link></li>
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
    </footer>
  )
}
