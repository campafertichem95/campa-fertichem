import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Target, Eye, Leaf, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 bg-emerald-950 text-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-600/50 backdrop-blur-md text-emerald-200 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>Campa Fertichem</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-200 to-green-400">Campa Fertichem</span>
            </h1>
            <p className="text-emerald-100/90 text-lg max-w-2xl font-normal leading-relaxed">
              A fertilizer manufacturer and supplier dedicated to supporting crop nutrition and agricultural productivity across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-emerald-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 bg-emerald-100/70 px-3 py-1 rounded-full">
                Who We Are
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Campa Fertichem</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Campa Fertichem is a fertilizer manufacturing and supply company based in Taloja, Navi Mumbai, Maharashtra, India.
                We specialize in providing a comprehensive range of fertilizer products designed to meet the nutritional requirements of various crops.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our product portfolio covers essential plant nutrients including nitrogen, phosphorus, potassium, and micronutrients,
                enabling farmers and agricultural professionals to address diverse crop nutrition needs effectively.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Located in the industrial hub of Taloja, Navi Mumbai, we are well-positioned to serve customers across Maharashtra and beyond.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85"
                  alt="Sustainable agriculture and green farming field at Campa Fertichem"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white bg-emerald-950/85 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30">
                  <p className="text-xs font-semibold text-lime-300 uppercase tracking-wider">Manufacturing Excellence</p>
                  <p className="text-sm font-medium mt-0.5">Advanced liquid blending and quality control at Taloja, Navi Mumbai.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                text: 'To provide high-quality fertilizer solutions that support healthy crop growth and help farmers achieve better agricultural outcomes through effective crop nutrition.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                text: 'To be a trusted fertilizer partner for farmers and agricultural businesses across India, contributing to improved crop productivity and sustainable farming practices.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-emerald-950/70 border border-emerald-700/40 rounded-3xl p-8 backdrop-blur-md shadow-xl group hover:border-lime-400/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800/80 text-lime-300 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-lime-300 transition-colors">{title}</h3>
                <p className="text-emerald-100/80 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2 bg-emerald-50 px-3 py-1 rounded-full">
              Our Strengths
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Comprehensive Product Range', desc: 'We offer fertilizers covering all major plant nutrients to address diverse crop nutrition requirements.' },
              { icon: Users, title: 'Customer-Focused Approach', desc: 'We work closely with our customers to understand their needs and recommend appropriate fertilizer solutions.' },
              { icon: Target, title: 'Quality Products', desc: 'Our fertilizers are formulated to deliver consistent nutritional value to support healthy crop development.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-emerald-950/5 border border-emerald-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group flex gap-5 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-800 group-hover:text-lime-300 transition-all mt-1">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white text-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Ready to Explore Our Products?</h2>
          <p className="text-emerald-100/90 text-lg mb-10 max-w-2xl mx-auto font-normal">Browse our fertilizer catalogue or get in touch with our team.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-lime-400 text-emerald-950 hover:bg-lime-300 font-bold px-8 py-6 rounded-xl shadow-xl transition-transform hover:scale-105">
              <Link to="/products">View Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-transform">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}