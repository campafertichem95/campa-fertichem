import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminCategoriesPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data) {
      setCategories(data)
      // fetch product counts per category
      const counts: Record<string, number> = {}
      await Promise.all(
        data.map(async (cat: any) => {
          const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', cat.id)
          counts[cat.id] = count ?? 0
        })
      )
      setProductCounts(counts)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const deleteCategory = async (id: string, name: string) => {
    const count = productCounts[id] ?? 0
    if (count > 0) {
      alert(`Cannot delete "${name}" — it has ${count} product(s). Reassign or delete those products first.`)
      return
    }
    if (!confirm(`Delete category "${name}"?`)) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link to="/admin/categories/new"><Plus className="h-4 w-4 mr-1" /> Add Category</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Products</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                </td></tr>
              ))
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No categories yet</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.image_path
                        ? <img src={cat.image_path} alt={cat.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />}
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">{productCounts[cat.id] ?? 0}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.is_active ? 'default' : 'secondary'}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/categories/${cat.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700"
                        onClick={() => deleteCategory(cat.id, cat.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
