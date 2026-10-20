import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Sprout } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3 border-b border-gray-100'
            : 'bg-white/90 backdrop-blur-xs py-4 border-b border-white/20'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/CF_Logo_cropped_1200w_1.png"
                alt="Campa Fertichem"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to)

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive: active }) =>
                      cn(
                        'relative py-1 text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center gap-1.5',
                        active ? 'text-emerald-800' : 'text-gray-700 hover:text-emerald-700'
                      )
                    }
                  >
                    {isActive && <Sprout className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{link.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeHeaderGlow"
                        className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Mobile Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6 text-emerald-800" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Top Scroll Indicator Line */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 origin-left"
        style={{ scaleX }}
      />

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg overflow-hidden"
          >
            <nav className="px-5 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to)

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={cn(
                      'px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && <Sprout className="w-4 h-4 text-emerald-600" />}
                  </NavLink>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}