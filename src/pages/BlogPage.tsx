import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 9

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [search])

  useEffect(() => {
    setLoading(true)
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) query = query.ilike('title', `%${search}%`)

    query.then(({ data, count }) => {
      setPosts(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    })
  }, [search, page])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Blog & Articles</h1>
          <p className="text-green-200 mt-2">Insights on crop nutrition and fertilizer solutions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-sm mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden bg-white">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No articles yet</h3>
            <p className="text-gray-500 text-sm">Check back soon for articles on crop nutrition and fertilizer solutions.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {post.featured_image_path ? (
                      <img
                        src={post.featured_image_path}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {post.published_at && (
                      <p className="text-xs text-gray-400 mb-2">{formatDate(post.published_at)}</p>
                    )}
                    <h2 className="font-semibold text-gray-900 line-clamp-2 mb-2">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-3 mb-3">{post.excerpt}</p>
                    )}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                    >
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
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
