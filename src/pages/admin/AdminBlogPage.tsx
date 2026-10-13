import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 20

export default function AdminBlogPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    if (search) q = q.ilike('title', `%${search}%`)
    const { data, count } = await q
    setPosts(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [search, page])

  useEffect(() => { setPage(0) }, [search])
  useEffect(() => { fetchPosts() }, [fetchPosts])

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await supabase.from('blog_posts').delete().eq('id', id)
    fetchPosts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link to="/admin/blog/new"><Plus className="h-4 w-4 mr-1" /> New Post</Link>
        </Button>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-4 py-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                </td></tr>
              ))
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No posts yet</td></tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 line-clamp-1 max-w-xs">{post.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                    {post.published_at ? formatDate(post.published_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/blog/${post.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700"
                        onClick={() => deletePost(post.id, post.title)}>
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
