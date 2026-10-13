import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tag, FileText, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'

interface Stats {
  products: number
  categories: number
  posts: number
  enquiries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, posts: 0, enquiries: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    ]).then(([p, c, b, e]) => {
      setStats({
        products: p.count ?? 0,
        categories: c.count ?? 0,
        posts: b.count ?? 0,
        enquiries: e.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, to: '/admin/products', color: 'text-green-700 bg-green-50' },
    { label: 'Active Categories', value: stats.categories, icon: Tag, to: '/admin/categories', color: 'text-blue-700 bg-blue-50' },
    { label: 'Published Posts', value: stats.posts, icon: FileText, to: '/admin/blog', color: 'text-purple-700 bg-purple-50' },
    { label: 'New Enquiries', value: stats.enquiries, icon: MessageSquare, to: '/admin/enquiries', color: 'text-orange-700 bg-orange-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={label} to={to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/admin/products/new', label: 'Add New Product', icon: Package },
          { to: '/admin/categories/new', label: 'Add Category', icon: Tag },
          { to: '/admin/blog/new', label: 'Write Blog Post', icon: FileText },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:border-green-500 hover:shadow-sm transition-all"
          >
            <Icon className="h-5 w-5 text-green-700" />
            <span className="font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
