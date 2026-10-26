import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { 
  ArrowRight, ChevronLeft, ChevronRight, Leaf, Shield, Users, 
  Package, Sprout, CheckCircle2, Droplets, TrendingUp, PhoneCall 
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category, Product } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

// ─── 1. Crops Marquee Ribbon ──────────────────────────────────────────────────
function CropsCarousel() {
  const crops = [
    'Sugarcane', 'Cotton', 'Soybean', 'Grapes', 'Pomegranate', 
    'Onion', 'Tomato', 'Paddy / Rice', 'Wheat', 'Maize', 
    'Chilli & Capsicum', 'Banana', 'Citrus Fruits', 'Pulses & Legumes'
  ]
  const duplicatedCrops = [...crops, ...crops]

  return (
    <div className="w-full bg-[#03140e] py-4 overflow-hidden border-y border-emerald-900/80 shadow-inner select-none relative">
      <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#03140e] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#03140e] to-transparent z-10 pointer-events-none" />
      <div className="overflow-hidden whitespace-nowrap flex w-full">
        <motion.div
          className="flex items-center gap-12 flex-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, repeatType: 'loop', duration: 36, ease: 'linear' }}
        >
          {duplicatedCrops.map((crop, idx) => (
            <div key={idx} className="flex items-center gap-12 flex-shrink-0">
              <span className="font-serif italic text-base sm:text-lg tracking-wide text-emerald-100/90 font-medium">
                {crop}
              </span>
              <span className="text-emerald-500 text-xs">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── 2. Hero Section with Video Background ────────────────────────────────────
function HeroSection() {
  const prefersReduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroVideo = (import.meta as any).env?.VITE_HERO_VIDEO_URL || 
    'https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-through-a-wheat-field-41584-large.mp4'
  const heroPoster = (import.meta as any).env?.VITE_HERO_POSTER_URL || 
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=85'

  const showVideo = heroVideo && !prefersReduced

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-emerald-950">
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <img src={heroPoster} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" fetchPriority="high" />
      )}

      {/* Multi-layer Sophisticated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            className="lg:col-span-8 text-white"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
              Nourishing Growth. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-200 to-green-400">
                Maximizing Harvests.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mb-6 font-normal leading-relaxed">
              Scientifically balanced liquid fertilizers and bio-nutrients for superior soil vitality and crop yields.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold px-8 py-6 rounded-xl shadow-xl transition-all hover:scale-105">
                <Link to="/products">
                  Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-300/60 bg-emerald-950/40 backdrop-blur-md text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all">
                <Link to="/contact">
                  <PhoneCall className="mr-2 h-4 w-4 text-emerald-300" /> Connect with Agronomist
                </Link>
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-6 border-t border-emerald-800/60 max-w-xl">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-lime-300">100%</p>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">Water Soluble</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-lime-300">Taloja</p>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">Manufacturing Hub</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-lime-300">15+</p>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">Major Crops</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ─── 3. Intro Section with HD Laboratory Scientist Image ──────────────────────
function IntroSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-emerald-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 bg-emerald-100/70 px-3 py-1 rounded-full">
              About Campa Fertichem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Engineering Soil Vitality for Modern Agriculture
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
              Based in Taloja, Navi Mumbai, Campa Fertichem specializes in high-purity liquid fertilizers, micro-element blends, bio-fertilizers, and plant growth regulators. We combine precision chemistry with deep regional agronomic insight.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-xs border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Immediate Absorption</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Liquid nutrition engineered for instant root uptake.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-xs border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Balanced Formulations</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Scientifically tested for regional Indian soils.</p>
                </div>
              </div>
            </div>

            <Button asChild className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl px-6 py-3">
              <Link to="/about">Discover Our Story & Plant</Link>
            </Button>
          </motion.div>

          <motion.div 
            className="lg:col-span-6 relative"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-emerald-900">
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=85" 
                alt="Laboratory testing and fertilizer formulation at Campa Fertichem" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white bg-emerald-950/85 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30">
                <p className="text-xs font-semibold text-lime-300 uppercase tracking-wider">Manufacturing Excellence</p>
                <p className="text-sm font-medium mt-0.5">Advanced liquid blending and rigorous quality control at Taloja, Navi Mumbai.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── 4. Category Card & Slider ────────────────────────────────────────────────
function CategoryCard({ cat, index, productCount }: { cat: Category; index: number; productCount: number }) {
  return (
    <motion.div
      key={cat.id}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/products?category=${cat.slug}`} className="block h-full group" tabIndex={0}>
        <div className="relative rounded-3xl overflow-hidden bg-emerald-900 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-emerald-800/40">
          <div className="aspect-[4/5] overflow-hidden">
            {cat.image_path ? (
              <img
                src={cat.image_path}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950">
                <Sprout className="h-16 w-16 text-emerald-400/60" />
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
            <Package className="h-3.5 w-3.5 text-emerald-700" />
            {productCount} Products
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <h3 className="font-bold text-lg uppercase tracking-wide leading-snug drop-shadow-md group-hover:text-lime-300 transition-colors">
              {cat.name}
            </h3>

            {cat.description && (
              <p className="text-xs text-gray-300 mt-1.5 line-clamp-2">
                {cat.description}
              </p>
            )}

            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-lime-300 group-hover:translate-x-1.5 transition-transform">
              Explore Range <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function CategorySection({ categories, productCounts }: { categories: Category[]; productCounts: Record<string, number> }) {
  const prefersReduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1)
      else if (window.innerWidth < 1024) setVisibleCount(2)
      else setVisibleCount(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const VISIBLE = visibleCount
  const total = categories.length
  const canPrev = current > 0
  const canNext = current < total - VISIBLE

  useEffect(() => { setCurrent(0) }, [visibleCount])

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.min(Math.max(c + dir, 0), Math.max(total - VISIBLE, 0)))
  }, [total, VISIBLE])

  const startTimer = useCallback(() => {
    if (prefersReduced || total <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c + 1
        return next > total - VISIBLE ? 0 : next
      })
    }, 4500)
  }, [prefersReduced, total, VISIBLE])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  if (!categories.length) return null

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div className="max-w-xl">
            <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2 bg-emerald-50 px-3 py-1 rounded-full">
              Product Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Formulated for Optimal Crop Yields
            </h2>
            <p className="text-gray-500 mt-2">
              Browse our core fertilizer and plant growth regulator categories designed for diverse agricultural needs.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous categories"
              className="w-12 h-12 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-900 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next categories"
              className="w-12 h-12 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-900 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden -mx-3 px-3 py-2">
          <motion.div
            className="flex"
            animate={{ x: prefersReduced ? 0 : `-${current * (100 / VISIBLE)}%` }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          >
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                productCount={productCounts[cat.id] ?? 0}
              />
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-semibold px-8 rounded-xl">
            <Link to="/products">
              View All Product Catalog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── 5. Featured Products Slider (Carousel) ───────────────────────────────────
function FeaturedCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      key={product.id}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Card className="h-full rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col bg-white">
        <div className="aspect-[4/3] bg-emerald-50 relative overflow-hidden">
          {product.image_path ? (
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="h-12 w-12 text-emerald-300" />
            </div>
          )}
        </div>

        <CardContent className="p-6 flex flex-col flex-grow">
          {product.categories && (
            <span className="text-xs text-green-700 font-medium mb-1">
              {product.categories.name}
            </span>
          )}
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
              {product.short_description}
            </p>
          )}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button asChild className="w-full bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold">
              <Link to={`/products/${product.slug}`}>
                View Product Details <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FeaturedProducts({ products }: { products: Product[] }) {
  const prefersReduced = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1)
      else if (window.innerWidth < 1024) setVisibleCount(2)
      else setVisibleCount(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const VISIBLE = visibleCount
  const total = products.length
  const canPrev = current > 0
  const canNext = current < total - VISIBLE

  useEffect(() => { setCurrent(0) }, [visibleCount])

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.min(Math.max(c + dir, 0), Math.max(total - VISIBLE, 0)))
  }, [total, VISIBLE])

  const startTimer = useCallback(() => {
    if (prefersReduced || total <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c + 1
        return next > total - VISIBLE ? 0 : next
      })
    }, 5000)
  }, [prefersReduced, total, VISIBLE])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  if (!products.length) return null

  return (
    <section className="py-24 bg-emerald-950/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2 bg-emerald-100 px-3 py-1 rounded-full">
              FEATURED PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trusted by Farmers Across India
            </h2>
            <p className="text-gray-500 mt-2">
              Discover our highest-rated agricultural nutrition products for superior crop performance.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous products"
              className="w-12 h-12 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-900 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next products"
              className="w-12 h-12 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-900 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden -mx-3 px-3 py-2">
          <motion.div
            className="flex"
            animate={{ x: prefersReduced ? 0 : `-${current * (100 / VISIBLE)}%` }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          >
            {products.map((product, i) => (
              <FeaturedCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-emerald-900 hover:bg-emerald-950 text-white font-semibold px-8 rounded-xl shadow-md">
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── 6. Why Choose Us Section ─────────────────────────────────────────────────
function WhyChooseUs() {
  const features = [
    {
      icon: Droplets,
      title: 'Advanced Liquid Technology',
      desc: 'Formulated for rapid leaf and root absorption, ensuring minimal nutrient loss and maximum efficiency.',
    },
    {
      icon: Shield,
      title: 'Rigorous Quality Assurance',
      desc: 'Produced at our state-of-the-art facility in Taloja, meeting strict agricultural quality standards.',
    },
    {
      icon: TrendingUp,
      title: 'Enhanced Crop Yields',
      desc: 'Proven nutrition profiles designed to boost vegetative growth, root strength, and fruit quality.',
    },
    {
      icon: Users,
      title: 'Expert Agronomy Support',
      desc: 'Dedicated technical guidance to help farmers select the right formulations for specific soil types.',
    },
  ]

  return (
    <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
            Why Campa Fertichem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built on Science. Trusted in the Field.
          </h2>
          <p className="text-emerald-100/80 mt-2 text-base">
            Why commercial farms and agricultural distributors rely on our products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-emerald-950/60 border border-emerald-700/40 rounded-3xl p-8 backdrop-blur-md hover:border-lime-400/50 transition-all duration-300 shadow-xl group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800/80 text-lime-300 mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white group-hover:text-lime-300 transition-colors">{f.title}</h3>
              <p className="text-sm text-emerald-100/70 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 7. CTA Banner ────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Partner With Us
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to Elevate Your Agricultural Yields?
        </h2>
        <p className="text-emerald-100/90 text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
          Contact our Taloja facility for product enquiries, custom agronomy formulation advice, or distributorship opportunities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-lime-400 text-emerald-950 hover:bg-lime-300 font-bold px-8 py-6 rounded-xl shadow-xl transition-transform hover:scale-105"
          >
            <Link to="/contact">Contact Our Team</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-transform"
          >
            <Link to="/products">Explore Product Range</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
      supabase
        .from('products')
        .select('*, categories(id, name, slug)')
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('sort_order')
        .limit(6),
    ]).then(async ([catRes, prodRes]) => {
      const cats: Category[] = catRes.data ?? []
      setCategories(cats)
      if (prodRes.data) setFeatured(prodRes.data as Product[])

      const counts: Record<string, number> = {}
      await Promise.all(
        cats.map(async cat => {
          const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', cat.id)
            .eq('is_published', true)
          counts[cat.id] = count ?? 0
        })
      )
      setProductCounts(counts)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <HeroSection />
      <CropsCarousel />
      <IntroSection />

      {loading ? (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <Skeleton className="h-6 w-36 mx-auto mb-3 rounded-full" />
              <Skeleton className="h-10 w-72 mx-auto mb-3" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CategorySection categories={categories} productCounts={productCounts} />
      )}

      <FeaturedProducts products={featured} />
      <WhyChooseUs />
      <CTABanner />
    </>
  )
}