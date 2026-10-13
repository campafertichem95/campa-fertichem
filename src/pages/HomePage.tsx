import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Shield, Users, Award, Package, Sprout } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category, Product } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

// ─── 3D Tilt + Zoom Lens Card ─────────────────────────────────────────────────
function CategoryCard({
  cat,
  index,
  productCount,
}: {
  cat: Category
  index: number
  productCount: number
}) {
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const lensX = useMotionValue(50)
  const lensY = useMotionValue(50)
  const [hovered, setHovered] = useState(false)

  // Smooth spring for tilt
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 })
  const scale   = useSpring(hovered ? 1.04 : 1, { stiffness: 300, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    rawX.set(x)
    rawY.set(y)
    // lens position as percentage
    lensX.set(((e.clientX - rect.left) / rect.width)  * 100)
    lensY.set(((e.clientY - rect.top)  / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
    lensX.set(50)
    lensY.set(50)
    setHovered(false)
  }

  return (
    <motion.div
      key={cat.id}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: 900 }}
    >
      <Link to={`/products?category=${cat.slug}`} className="block h-full" tabIndex={0}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={prefersReduced ? {} : { rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
          className="relative rounded-2xl overflow-hidden bg-green-100 shadow-md cursor-pointer"
        >
          {/* ── Image with zoom-in on hover ── */}
          <div className="aspect-[3/4] overflow-hidden">
            {cat.image_path ? (
              <motion.img
                src={cat.image_path}
                alt={cat.name}
                loading="lazy"
                animate={prefersReduced ? {} : { scale: hovered ? 1.18 : 1 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                <Sprout className="h-16 w-16 text-green-400" />
              </div>
            )}
          </div>

          {/* ── Gradient overlay — darkens more on hover ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ background: hovered
              ? 'linear-gradient(to top, rgba(2,44,20,0.95) 0%, rgba(2,44,20,0.45) 55%, rgba(0,0,0,0.1) 100%)'
              : 'linear-gradient(to top, rgba(2,44,20,0.82) 0%, rgba(2,44,20,0.25) 55%, rgba(0,0,0,0) 100%)'
            }}
            transition={{ duration: 0.35 }}
          />

          {/* ── Magnetic zoom-lens spotlight ── */}
          {hovered && !prefersReduced && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle 90px at ${lensX.get()}% ${lensY.get()}%, rgba(255,255,255,0.13) 0%, transparent 70%)`,
              }}
            />
          )}

          {/* ── Product count badge ── */}
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold px-2.5 py-1 rounded-full shadow"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: index * 0.08 + 0.3 }}
          >
            <Package className="h-3 w-3" />
            {productCount} Products
          </motion.div>

          {/* ── Bottom text — slides up on hover ── */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <motion.h3
              className="font-bold text-base leading-tight"
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {cat.name}
            </motion.h3>

            {/* Description — fades in on hover */}
            <motion.p
              className="text-xs text-green-200 mt-1 line-clamp-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
            >
              {cat.description}
            </motion.p>

            {/* Explore pill — slides up on hover */}
            <motion.span
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: 0.28 }}
            >
              Explore Category
              <ArrowRight className="h-3 w-3" />
            </motion.span>
          </div>

          {/* ── 3D depth border glow ── */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ boxShadow: hovered
              ? '0 0 0 2px rgba(74,222,128,0.6), 0 24px 48px rgba(0,0,0,0.35)'
              : '0 0 0 0px transparent, 0 4px 12px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
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

  const VISIBLE = 4
  const total = categories.length
  const canPrev = current > 0
  const canNext = current < total - VISIBLE

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent(c => Math.min(Math.max(c + dir, 0), Math.max(total - VISIBLE, 0)))
    },
    [total]
  )

  const startTimer = useCallback(() => {
    if (prefersReduced || total <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c + 1
        return next > total - VISIBLE ? 0 : next
      })
    }, 3800)
  }, [prefersReduced, total])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const pause  = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => startTimer()

  if (!categories.length) return null

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
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

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Prev */}
          <button
            onClick={() => go(-1)}
            disabled={!canPrev}
            aria-label="Previous category"
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 hover:border-green-400 hover:scale-110 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Viewport */}
          <div className="overflow-hidden mx-6">
            <motion.div
              className="flex gap-5"
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

          {/* Next */}
          <button
            onClick={() => go(1)}
            disabled={!canNext}
            aria-label="Next category"
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 hover:border-green-400 hover:scale-110 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
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
                  animate={{ width: i === current ? 24 : 10, height: 10, opacity: i === current ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>
        )}

        {/* View all */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
            <Link to="/products">View All Products <ArrowRight className="ml-1 h-4 w-4" /></Link>
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
  const visible = 3
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
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-40" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setIdx(i => Math.min(max, i + 1))} disabled={idx >= max}
              className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-40" aria-label="Next">
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
                      <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {product.categories && (
                      <span className="text-xs text-green-700 font-medium">{product.categories.name}</span>
                    )}
                    <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
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
    { icon: Leaf,   title: 'Wide Product Range',   desc: 'Comprehensive fertilizer solutions covering nitrogen, phosphorus, potassium, and micronutrients.' },
    { icon: Shield, title: 'Quality Commitment',   desc: 'Products formulated to meet crop nutritional requirements with consistent quality standards.' },
    { icon: Users,  title: 'Customer Support',     desc: 'Dedicated support to help you choose the right fertilizer solution for your crops.' },
    { icon: Award,  title: 'Crop Nutrition Focus', desc: 'Specialized knowledge in crop nutrition to help maximize agricultural productivity.' },
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
  const heroVideo  = (import.meta as any).env?.VITE_HERO_VIDEO_URL  || ''
  const heroPoster = (import.meta as any).env?.VITE_HERO_POSTER_URL || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80'

  return (
    <section className="relative h-[90vh] min-h-[500px] flex items-center overflow-hidden">
      {heroVideo && !prefersReduced ? (
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo} poster={heroPoster} autoPlay muted loop playsInline aria-hidden="true" />
      ) : (
        <img src={heroPoster} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-green-950/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }} className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Nourishing Growth Fertilizer.<br />Enabling Tomorrow.
          </h1>
          <p className="text-lg sm:text-xl text-green-100 mb-8">
            Quality Fertilizer Solutions for Better Crop Nutrition.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-green-500 hover:bg-green-400 text-green-950 font-semibold">
              <Link to="/products">Explore Our Products <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-green-900 transition-colors">
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
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-green-700 font-semibold text-sm uppercase tracking-wider mb-3">About Campa Fertichem</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Committed to Crop Nutrition Excellence</h2>
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
          <Button asChild size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-green-700 transition-colors">
            <Link to="/contact">Send an Enquiry</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [categories, setCategories]     = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [featured, setFeatured]         = useState<Product[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('products').select('*, categories(id, name, slug)')
        .eq('is_featured', true).eq('is_published', true).order('sort_order').limit(9),
    ]).then(async ([catRes, prodRes]) => {
      const cats: Category[] = catRes.data ?? []
      setCategories(cats)
      if (prodRes.data) setFeatured(prodRes.data as Product[])

      const counts: Record<string, number> = {}
      await Promise.all(
        cats.map(async (cat) => {
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
