import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product, Category } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PAGE_SIZE = 20

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [page, setPage] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('products')
      .select('*, categories(id, name)', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) q = q.ilike('name', `%${search}%`)
    if (catFilter) q = q.eq('category_id', catFilter)

    const { data, count } = await q
    setProducts(data as Product[] ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [search, catFilter, page])

  useEffect(() => {
    supabase.from('categories').select('id, name').order('name').then(({ data }) => {
      if (data) setCategories(data as Category[])
    })
  }, [])

  useEffect(() => { setPage(0) }, [search, catFilter])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link to="/admin/products/new"><Plus className="h-4 w-4 mr-1" /> Add Product</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No products found</td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_path ? (
                        <img src={p.image_path} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                      )}
                      <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                    {(p.categories as Category | undefined)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={p.is_published ? 'default' : 'secondary'}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                    {p.is_featured ? '★ Featured' : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/products/${p.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteProduct(p.id, p.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {total > PAGE_SIZE && (
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-500">{total} total</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
