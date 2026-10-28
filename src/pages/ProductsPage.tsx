import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Leaf, SlidersHorizontal, Pointer } from 'lucide-react'
import { motion } from 'motion/react'
import { supabase } from '@/lib/supabase'
import type { Category, Product } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow group">
        <div className="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
          {product.image_path ? (
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <span className="text-xs text-green-700 font-medium">{product.categories.name}</span>
          )}
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">{product.name}</h3>
          {product.short_description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
          )}
          <div className="flex gap-2 mt-3">
            {/* Home page सारखाच exact Deep Emerald Green कलर */}
            <Button asChild size="sm" className="flex-1 bg-emerald-900 hover:bg-emerald-950 text-white text-xs rounded-xl font-semibold shadow-md">
              <Link to={`/products/${product.slug}`}>View Details</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 border-emerald-900 text-emerald-900 hover:bg-emerald-50 text-xs rounded-xl font-semibold">
              <Link to={`/contact?product=${product.id}`}>Enquire</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProductSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-8 w-full mt-3" />
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const selectedSlug = searchParams.get('category') || ''

  const selectedCategory = categories.find(c => c.slug === selectedSlug)

  const fetchProducts = useCallback(async (catId: string | null, q: string, pg: number) => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('is_published', true)
      .order('sort_order')
      .range(pg * PAGE_SIZE, (pg + 1) * PAGE_SIZE - 1)

    if (catId) query = query.eq('category_id', catId)
    if (q) query = query.ilike('name', `%${q}%`)

    const { data, count } = await query
    setProducts(data as Product[] ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  useEffect(() => {
    setPage(0)
  }, [selectedSlug, search])

  useEffect(() => {
    fetchProducts(selectedCategory?.id ?? null, search, page)
  }, [selectedCategory, search, page, fetchProducts])

  const selectCategory = (slug: string) => {
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-emerald-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Our Products</h1>
          <p className="text-emerald-200 mt-2">Browse our complete range of fertilizer solutions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <SlidersHorizontal className="h-5 w-5 text-gray-400" />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => selectCategory('')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors category-product-btn',
              !selectedSlug ? 'bg-emerald-900 text-white' : 'bg-white border text-gray-700 hover:bg-emerald-50'
            )}
            style={{cursor:'pointer'}}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.slug)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedSlug === cat.slug ? 'bg-emerald-900 text-white' : 'bg-white border text-gray-700 hover:bg-emerald-50'
              )}
                 style={{cursor:'pointer'}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {total} product{total !== 1 ? 's' : ''} found
            {selectedCategory ? ` in ${selectedCategory.name}` : ''}
          </p>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm">
              {selectedCategory
                ? `No published products in ${selectedCategory.name} yet.`
                : 'No products match your search.'}
            </p>
            {selectedSlug && (
              <Button variant="outline" className="mt-4" onClick={() => selectCategory('')}>
                View All Products
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div className="flex justify-center gap-2 mt-10">
                <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
                </span>
                <Button variant="outline" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}