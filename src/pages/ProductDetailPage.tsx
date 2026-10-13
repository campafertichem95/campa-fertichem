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
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm mb-3">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-20 w-20 text-gray-200" />
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-green-700' : 'border-transparent'}`}
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
              <Badge variant="secondary" className="mb-3 text-green-700 bg-green-50">
                {product.categories.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-gray-600 text-lg mb-6">{product.short_description}</p>
            )}
            {product.description && (
              <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {specs && Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications / Composition</h3>
                <div className="bg-white rounded-lg border overflow-hidden">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex border-b last:border-0">
                      <span className="w-1/2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">{key}</span>
                      <span className="w-1/2 px-4 py-2 text-sm text-gray-600">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.usage_information && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.usage_information}</p>
              </div>
            )}

            <Button asChild size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
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
