import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/CF_Logo_cropped_1200w_1.png"
              alt="Campa Fertichem"
              className="h-10 w-auto object-contain"
            />
          </Link>

         

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                )}
              >
                {link.label}
              </NavLink>
            ))}
            {/* <Button asChild size="sm" className="ml-2 bg-green-700 hover:bg-green-800">
              <Link to="/contact">Get a Quote</Link>
            </Button> */}
          </nav>

          <button
            className="md:hidden p-2 rounded-md text-gray-700"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => cn(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    isActive ? 'text-green-700 bg-green-50' : 'text-gray-700'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              <Button asChild size="sm" className="mt-2 bg-green-700 hover:bg-green-800">
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
