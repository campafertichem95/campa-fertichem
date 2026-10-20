import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Leaf, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data }) => {
        if (data) {
          setProduct(data as unknown as Product)
          setActiveImage((data as any).image_path)
        }
        setLoading(false)
      })
  }, [slug])

  // Usage info मधील मथळे बोल्ड करून तंतोतंत text-sm आणि सरळ अलाइनमेंट देणारे फंक्शन
  const renderUsageInformation = (text: string) => {
    if (!text) return null

    const labels = [
      'Composition',
      'Benefits',
      'Suitable Crops',
      'Foliar Application',
      'Drip Application',
      'Dosage',
      'Application Method',
      'Directions for Use',
      'Usage Recommendations',
    ]

    const pattern = new RegExp(`(${labels.join('|')}):`, 'g')
    const formatted = text.replace(pattern, '\n$1:')

    return formatted
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const colonIndex = line.indexOf(':')
        if (colonIndex !== -1) {
          const title = line.substring(0, colonIndex + 1)
          const desc = line.substring(colonIndex + 1).trim()
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6 py-2.5 border-b border-emerald-100/60 last:border-b-0"
            >
              {/* डावीकडील मथळा - फिक्स रुंदी (w-44) आणि बोल्ड */}
              <span className="sm:w-44 shrink-0 font-bold text-gray-900 text-sm tracking-tight">
                {title}
              </span>
              {/* उजवीकडील माहिती - तंतोतंत text-sm आणि शांत रंग */}
              <span className="flex-1 text-gray-700 text-sm leading-relaxed font-normal">
                {desc}
              </span>
            </div>
          )
        }
        return (
          <p key={idx} className="text-sm text-gray-700 leading-relaxed py-1.5 font-normal">
            {line}
          </p>
        )
      })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Leaf className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">This product may have been removed or is not available.</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    )
  }

  const gallery = [product.image_path, ...(product.gallery ?? [])].filter(Boolean) as string[]
  const specs = product.specifications as Record<string, string> | null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-8 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm mb-3 border border-gray-100">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-20 w-20 text-gray-200" />
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === img ? 'border-green-700' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.categories && (
              <Badge variant="secondary" className="mb-3 text-emerald-800 bg-emerald-50 border border-emerald-100 font-semibold px-3 py-1">
                {product.categories.name}
              </Badge>
            )}
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {product.name}
            </h1>

            {/* वरचा मुख्य परिच्छेद - तंतोतंत text-sm (14px) आणि खालील मजकुरासारखाच रंग व लीडिंग */}
            {(product.short_description || product.description) && (
              <p className="text-sm text-gray-700 leading-relaxed font-normal mb-5">
                {product.short_description || product.description}
              </p>
            )}

            {/* Specifications / Composition Table (जर उपलब्ध असेल तर) */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Specifications / Composition
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex border-b border-gray-100 last:border-0">
                      <span className="w-1/2 px-4 py-2.5 text-sm font-bold text-gray-800 bg-gray-50/70 border-r border-gray-100">
                        {key}
                      </span>
                      <span className="w-1/2 px-4 py-2.5 text-sm text-gray-700 font-normal">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Information - एकसारखी फॉन्ट साईझ, बोल्ड टायटल्स आणि परफेक्ट अलाइनमेंट */}
            {product.usage_information && (
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  USAGE INFORMATION
                </h3>
                <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                  {renderUsageInformation(product.usage_information)}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm px-6 py-3 font-semibold text-sm">
              <Link to={`/contact?product=${product.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" /> Enquire About This Product
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}