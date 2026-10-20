import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Shield, Users, Award, Package, Sprout } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category, Product } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

// ─── Clean Agricultural Crops Marquee (Right to Left) ──────────────────────────
function CropsCarousel() {
  const crops = [
    'Sugarcane',
    'Cotton',
    'Soybean',
    'Grapes',
    'Pomegranate',
    'Onion',
    'Tomato',
    'Paddy / Rice',
    'Wheat',
    'Maize',
    'Vegetables & Horticulture',
  ]

  const duplicatedCrops = [...crops, ...crops]

  return (
    <div className="relative w-full bg-emerald-950 text-emerald-100 py-3 border-b border-emerald-900 overflow-hidden shadow-inner">
      <div className="flex items-center">
        {/* Left Fixed Badge */}
        <div className="z-10 bg-emerald-900/90 px-5 py-1 border-r border-emerald-800 flex items-center gap-2 shadow-md flex-shrink-0">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 whitespace-nowrap">
            Tailored For
          </span>
        </div>

        {/* Right to Left Scrolling Track */}
        <div className="overflow-hidden whitespace-nowrap flex flex-1">
          <motion.div
            className="flex items-center gap-8 flex-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            }}
          >
            {duplicatedCrops.map((crop, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm font-medium tracking-wide text-white hover:text-emerald-300 transition-colors">
                  {crop}
                </span>
                <span className="text-emerald-500 text-xs">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Clean Category Card ──────────────────────────────────────────────────────
function CategoryCard({
  cat,
  index,
  productCount,
}: {
  cat: Category
  index: number
  productCount: number
}) {
  return (
    <motion.div
      key={cat.id}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/products?category=${cat.slug}`} className="block h-full group" tabIndex={0}>
        <div className="relative rounded-2xl overflow-hidden bg-green-100 shadow-md hover:shadow-2xl transition-all duration-300 h-full">
          {/* Image */}
          <div className="aspect-[3/4] overflow-hidden">
            {cat.image_path ? (
              <img
                src={cat.image_path}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                <Sprout className="h-16 w-16 text-green-400" />
              </div>
            )}
          </div>

          {/* Premium Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          {/* Product Count Badge */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
            <Package className="h-3.5 w-3.5 text-green-700" />
            {productCount} Products
          </div>

          {/* Bottom Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
            <h3 className="font-bold text-base uppercase tracking-wider leading-snug drop-shadow-md group-hover:text-green-300 transition-colors">
              {cat.name}
            </h3>

            {cat.description && (
              <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                {cat.description}
              </p>
            )}

            <span className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-green-300 group-hover:translate-x-1 transition-transform">
              Explore Category
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Category Slider Section ──────────────────────────────────────────────────
function CategorySection({
  categories,
  productCounts,
}: {
  categories: Category[]
  productCounts: Record<string, number>
}) {
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

  useEffect(() => {
    setCurrent(0)
  }, [visibleCount])

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent(c => Math.min(Math.max(c + dir, 0), Math.max(total - VISIBLE, 0)))
    },
    [total, VISIBLE]
  )

  const startTimer = useCallback(() => {
    if (prefersReduced || total <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c + 1
        return next > total - VISIBLE ? 0 : next
      })
    }, 4000)
  }, [prefersReduced, total, VISIBLE])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }
  const resume = () => startTimer()

  if (!categories.length) return null

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-green-700 font-semibold text-sm uppercase tracking-wider mb-2">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Product Categories</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Explore our complete range of fertilizer solutions tailored for every crop and soil type
          </p>
        </motion.div>

        <div className="relative" onMouseEnter={pause} onMouseLeave={resume}>
          <button
            onClick={() => go(-1)}
            disabled={!canPrev}
            aria-label="Previous category"
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:text-green-700 hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: prefersReduced ? 0 : `-${current * (100 / VISIBLE)}%`
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
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

          <button
            onClick={() => go(1)}
            disabled={!canNext}
            aria-label="Next category"
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:text-green-700 hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {total > VISIBLE && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              >
                <motion.span
                  className="block rounded-full bg-green-600"
                  animate={{
                    width: i === current ? 24 : 10,
                    height: 10,
                    opacity: i === current ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
            <Link to="/products">
              View All Products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Featured Products ────────────────────────────────────────────────────────
function FeaturedProducts({ products }: { products: Product[] }) {
  const [idx, setIdx] = useState(0)
  const prefersReduced = useReducedMotion()
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1)
      else if (window.innerWidth < 1024) setVisible(2)
      else setVisible(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    setIdx(0)
  }, [visible])

  const max = Math.max(0, products.length - visible)

  if (!products.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Our highlighted fertilizer solutions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-40"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIdx(i => Math.min(max, i + 1))}
              disabled={idx >= max}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-40"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={prefersReduced ? {} : { x: `-${idx * (100 / visible)}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {products.map(product => (
              <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                    {product.image_path ? (
                      <img
                        src={product.image_path}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {product.categories && (
                      <span className="text-xs text-green-700 font-medium">
                        {product.categories.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    <Button asChild size="sm" className="mt-3 w-full bg-green-700 hover:bg-green-800">
                      <Link to={`/products/${product.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const features = [
    {
      icon: Leaf,
      title: 'Wide Product Range',
      desc: 'Comprehensive fertilizer solutions covering nitrogen, phosphorus, potassium, and micronutrients.',
    },
    {
      icon: Shield,
      title: 'Quality Commitment',
      desc: 'Products formulated to meet crop nutritional requirements with consistent quality standards.',
    },
    {
      icon: Users,
      title: 'Customer Support',
      desc: 'Dedicated support to help you choose the right fertilizer solution for your crops.',
    },
    {
      icon: Award,
      title: 'Crop Nutrition Focus',
      desc: 'Specialized knowledge in crop nutrition to help maximize agricultural productivity.',
    },
  ]

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Campa Fertichem?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <f.icon className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const prefersReduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroVideo = (import.meta as any).env?.VITE_HERO_VIDEO_URL || ''
  const heroPoster =
    (import.meta as any).env?.VITE_HERO_POSTER_URL ||
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80'

  return (
    <section className="relative h-[90vh] min-h-[500px] flex items-center overflow-hidden">
      {heroVideo && !prefersReduced ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <img src={heroPoster} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-green-950/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Nourishing Growth Fertilizer.<br />Enabling Tomorrow.
          </h1>
          <p className="text-lg sm:text-xl text-green-100 mb-8">
            Quality Fertilizer Solutions for Better Crop Nutrition.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-green-500 hover:bg-green-400 text-green-950 font-semibold">
              <Link to="/products">
                Explore Our Products <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-green-900 transition-colors"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Intro ────────────────────────────────────────────────────────────────────
function IntroSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block text-green-700 font-semibold text-sm uppercase tracking-wider mb-3">
            About Campa Fertichem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Committed to Crop Nutrition Excellence
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Campa Fertichem is a fertilizer manufacturer and supplier based in Taloja, Navi Mumbai, Maharashtra, India.
            We provide a comprehensive range of fertilizer solutions designed to support healthy crop growth and improve agricultural productivity.
            Our focus is on delivering quality products that meet the nutritional needs of diverse crops across India.
          </p>
          <Button asChild variant="outline" className="mt-8 border-green-700 text-green-700 hover:bg-green-50">
            <Link to="/about">Learn More About Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-16 bg-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Looking for the Right Fertilizer Solution?</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">
          Browse our complete product catalogue or reach out to our team for personalized recommendations.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-green-700 hover:bg-green-50">
            <Link to="/products">Explore Products</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-transparent border border-white text-white hover:bg-white hover:text-green-700 transition-colors"
          >
            <Link to="/contact">Send an Enquiry</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
        .limit(9),
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

      {/* Hero Section च्या खाली लगेच सुरू होणारा Crops Marquee */}
      <CropsCarousel />

      <IntroSection />

      {loading ? (
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-5 w-32 mx-auto mb-3" />
              <Skeleton className="h-9 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
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