import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/database'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data }) => {
        setPost(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="aspect-video rounded-xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Article Not Found</h1>
        <Link to="/blog" className="text-green-700 hover:underline mt-2">Back to Blog</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {post.featured_image_path && (
          <img
            src={post.featured_image_path}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-xl mb-8"
          />
        )}

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Calendar className="h-4 w-4" />
          {post.published_at ? formatDate(post.published_at) : ''}
          {post.category && <span className="ml-2 text-green-700 font-medium">{post.category}</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        {post.excerpt && (
          <p className="text-lg text-gray-600 border-l-4 border-green-500 pl-4 mb-8">{post.excerpt}</p>
        )}

        {post.content && (
          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        )}
      </div>
    </div>
  )
}
