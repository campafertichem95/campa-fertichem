import { Link } from 'react-router-dom'
import { Leaf, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#062016] via-[#041710] to-[#020b08] text-emerald-100/80 border-t border-emerald-500/20">
      
      {/* ── Top Subtle Ambient Light Glow ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/40 text-emerald-400">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-bold text-white text-lg tracking-wide">Campa Fertichem</span>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed mb-4">
              Quality fertilizer solutions for better crop nutrition. Serving farmers across India from Taloja, Navi Mumbai.
            </p>

          {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {/* Instagram Original Gradient Icon */}
              <a
                href="https://www.instagram.com/campafertichem?stkn=ajB0N3B4ZTlsczNn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <radialGradient id="ig-grad" cx="20%" cy="110%" r="140%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </radialGradient>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig-grad)" />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                  />
                </svg>
              </a>

              {/* Facebook Original Blue Icon */}
              <a
                href="https://www.facebook.com/profile.php?id=61594347011206"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="11" fill="#1877F2" />
                  <path
                    d="M15.12 12.75l.48-3.13h-3v-2.03c0-.85.42-1.68 1.76-1.68h1.36V3.25c-.8-.11-1.61-.17-2.42-.16-2.46 0-4.07 1.49-4.07 4.19v2.34H6.5v3.13h2.73V21a11.1 11.1 0 0 0 3.38 0v-8.25h2.51z"
                    fill="#ffffff"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/', 'Home'],
                ['/about', 'About Us'],
                ['/products', 'Products'],
                ['/blog', 'Blog'],
                ['/contact', 'Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-emerald-100/70 hover:text-white transition-colors block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2.5">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="text-emerald-100/70 hover:text-white transition-colors block">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=plant-growth-regulators" className="text-emerald-100/70 hover:text-white transition-colors block">
                  Plant Growth Regulators
                </Link>
              </li>
              <li>
                <Link to="/products?category=npk-fortified-liquid-fertilizer" className="text-emerald-100/70 hover:text-white transition-colors block">
                  NPK Fortified Liquid Fertilizer
                </Link>
              </li>
              <li>
                <Link to="/products?category=micronutrients" className="text-emerald-100/70 hover:text-white transition-colors block">
                  Micronutrients
                </Link>
              </li>
              <li>
                <Link to="/products?category=bio-fertilizers" className="text-emerald-100/70 hover:text-white transition-colors block">
                  Bio Fertilizers
                </Link>
              </li>
              <li>
                <Link to="/products?category=npk-special" className="text-emerald-100/70 hover:text-white transition-colors block">
                  NPK Special
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2.5">
              Contact
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5 text-emerald-100/70 leading-snug">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                <span>
                  B201 Devdrishti, CHS Plot No. 62, Navade Phase 2, Taloja, Navi Mumbai, Maharashtra, India
                </span>
              </li>
              <li>
                <a href="tel:+917276772958" className="flex items-center gap-2.5 text-emerald-100/80 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>+91 72767 72958 / 99221 60100</span>
                </a>
              </li>
              <li>
                <a href="mailto:campafertichem@gmail.com" className="flex items-center gap-2.5 text-emerald-100/80 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>campafertichem@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-emerald-950/80 mt-10 pt-6 text-center text-xs text-emerald-300/40">
          <p>© {new Date().getFullYear()} Campa Fertichem. All rights reserved.</p>
          <p>design.kraftmedia@gmail.com</p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917276772958?text=Hello%20Campa%20Fertichem"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-7 right-7 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300"
      >
        <svg
          className="w-8 h-8 fill-white"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.68.75 5.18 2.06 7.32L2 30l6.87-2.02A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm8.17 19.83c-.34.96-1.7 1.76-2.38 1.84-.66.08-1.52.12-4.46-1.1-3.75-1.56-6.17-5.38-6.36-5.63-.19-.25-1.52-2.02-1.52-3.86s.96-2.74 1.3-3.11c.34-.37.74-.46.99-.46h.72c.23 0 .54-.09.84.64.31.75 1.06 2.58 1.15 2.77.09.19.16.41.03.66-.12.25-.19.41-.37.62-.19.22-.39.49-.56.66-.19.19-.38.39-.16.77.22.37.97 1.59 2.08 2.58 1.43 1.27 2.63 1.66 3 1.85.37.19.59.16.81-.09.22-.25.93-1.09 1.18-1.46.25-.37.5-.31.84-.19.34.12 2.18 1.03 2.55 1.22.37.19.62.28.71.44.09.15.09.9-.25 1.86z"/>
        </svg>
      </a>
    </footer>
  )
}