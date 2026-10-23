import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Target, Eye, Leaf, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Campa Fertichem</h1>
            <p className="text-green-200 text-lg max-w-2xl">
              A fertilizer manufacturer and supplier dedicated to supporting crop nutrition and agricultural productivity across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-green-700 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
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
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                alt="Agricultural fields"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <Icon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <Icon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Our Products?</h2>
          <p className="text-green-100 mb-8">Browse our fertilizer catalogue or get in touch with our team.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-green-50">
              <Link to="/products">View Products</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
