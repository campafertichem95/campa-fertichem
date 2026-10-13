import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  is_published: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function AdminBlogFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_published: false },
  })

  const titleValue = watch('title')

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          const d = data as Record<string, unknown>
          ;(Object.keys(schema.shape) as (keyof FormData)[]).forEach(k => {
            if (k in d) setValue(k, d[k] as never)
          })
          if (d.featured_image_path) setImagePreview(d.featured_image_path as string)
        }
      })
    }
  }, [id, isNew, setValue])

  useEffect(() => {
    if (isNew && titleValue) setValue('slug', slugify(titleValue))
  }, [titleValue, isNew, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    return data.publicUrl
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setError(null)
    let featuredImagePath = imagePreview
    if (imageFile) {
      featuredImagePath = await uploadImage(imageFile)
      if (!featuredImagePath) { setError('Image upload failed.'); setSaving(false); return }
    }
    const payload = {
      ...data,
      featured_image_path: featuredImagePath,
      published_at: data.is_published ? new Date().toISOString() : null,
    }
    if (isNew) {
      const { error: err } = await supabase.from('blog_posts').insert(payload as any)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('blog_posts').update(payload as any).eq('id', id!)
      if (err) { setError(err.message); setSaving(false); return }
    }
    navigate('/admin/blog')
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New Post' : 'Edit Post'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Featured image */}
        <div className="bg-white rounded-xl border p-6">
          <Label className="mb-3 block">Featured Image</Label>
          <div className="flex items-start gap-4">
            <div className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <Upload className="h-8 w-8 text-gray-300" />}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" /> Upload Image
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input {...register('title')} className="mt-1" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label>URL Slug *</Label>
              <Input {...register('slug')} className="mt-1" />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <Input {...register('category')} className="mt-1" placeholder="e.g. Crop Nutrition" />
          </div>
          <div>
            <Label>Excerpt / Summary</Label>
            <Textarea {...register('excerpt')} className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Article Content</Label>
            <Textarea {...register('content')} className="mt-1" rows={12} placeholder="Write your article here..." />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">SEO</h2>
          <div>
            <Label>SEO Title</Label>
            <Input {...register('seo_title')} className="mt-1" />
          </div>
          <div>
            <Label>SEO Meta Description</Label>
            <Textarea {...register('seo_description')} className="mt-1" rows={2} />
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Published</p>
              <p className="text-xs text-gray-500">Visible to public visitors</p>
            </div>
            <Controller name="is_published" control={control} render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )} />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800">
            {saving ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
