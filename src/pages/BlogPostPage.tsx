import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
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
        if (data) setPost(data as BlogPost)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <FileText className="h-12 w-12 text-gray-300 mb-3" />
        <h1 className="text-xl font-bold text-gray-800 mb-1">Article Not Found</h1>
        <p className="text-sm text-gray-500 mb-4">The requested article could not be found.</p>
        <Button onClick={() => navigate('/blog')} variant="outline">Back to Blog</Button>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white text-gray-900 pb-20">
      
      {/* 1. Header & Breadcrumb */}
      <div className="border-b bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 font-medium mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 leading-tight mb-3">
            {post.title}
          </h1>

          {post.published_at && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* 2. Featured Image (जर असेल तर) */}
        {post.featured_image_path && (
          <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-8 border border-gray-100 shadow-sm">
            <img 
              src={post.featured_image_path} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* 3. Short Excerpt (जर असेल तर) */}
        {post.excerpt && (
          <div className="p-5 rounded-xl bg-green-50/60 border border-green-100 text-green-950 font-medium text-base leading-relaxed mb-8">
            {post.excerpt}
          </div>
        )}

        {/* 4. Main Body Content (कोलन असलेले शब्द आणि मथळे आपोआप Bold होतील) */}
        <div className="space-y-3 text-gray-700 text-base sm:text-lg leading-relaxed">
          {post.content?.split('\n').map((line, idx) => {
            const trimmed = line.trim()
            if (!trimmed) return <div key={idx} className="h-2" />

            // बुलेट पॉईंट्स (• किंवा -)
            if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
              const text = trimmed.replace(/^[•\-]\s*/, '')
              const colonIndex = text.indexOf(':')

              if (colonIndex !== -1) {
                const label = text.substring(0, colonIndex + 1)
                const desc = text.substring(colonIndex + 1)
                return (
                  <div key={idx} className="flex items-start gap-2.5 ml-2 sm:ml-4 text-sm sm:text-base">
                    <span className="text-green-700 font-bold text-lg leading-none mt-1 flex-shrink-0">•</span>
                    <span>
                      <strong className="font-bold text-gray-950">{label}</strong>
                      {desc}
                    </span>
                  </div>
                )
              }

              return (
                <div key={idx} className="flex items-start gap-2.5 ml-2 sm:ml-4 text-sm sm:text-base">
                  <span className="text-green-700 font-bold text-lg leading-none mt-1 flex-shrink-0">•</span>
                  <span>{text}</span>
                </div>
              )
            }

            // क्रमांक असलेले मथळे (उदा. 1. Title किंवा ओळीच्या शेवटी कोलन :)
            const isNumbered = /^\d+\./.test(trimmed)
            const endsWithColon = trimmed.endsWith(':')

            if (isNumbered || endsWithColon) {
              return (
                <div key={idx} className="pt-3 pb-1">
                  <p className="font-bold text-gray-950 text-lg sm:text-xl">
                    {trimmed}
                  </p>
                </div>
              )
            }

            // ओळीच्या मध्ये कोलन आला असेल तर (उदा. Title: Description)
            const midColonIndex = trimmed.indexOf(':')
            if (midColonIndex !== -1 && midColonIndex < 40) {
              const title = trimmed.substring(0, midColonIndex + 1)
              const body = trimmed.substring(midColonIndex + 1)
              return (
                <p key={idx}>
                  <strong className="font-bold text-gray-950">{title}</strong>
                  {body}
                </p>
              )
            }

            // साधा परिच्छेद
            return (
              <p key={idx}>
                {trimmed}
              </p>
            )
          })}
        </div>

      </div>

    </article>
  )
}