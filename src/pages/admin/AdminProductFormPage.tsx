import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, Bold, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category_id: z.string().min(1, 'Category is required'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  usage_information: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  sort_order: z.number(),
})

type FormData = z.infer<typeof schema>

// Auto-converts plain headings (Benefits, Dose, Usage) to Markdown bold before saving
function autoFormatText(text?: string): string {
  if (!text) return ''
  const lines = text.split('\n')
  const headers = ['GROWMAX', 'BENEFITS', 'DOSE', 'USAGE', 'FEATURES', 'COMPOSITION', 'APPLICATION']

  const formatted = lines.map((line, idx) => {
    const trimmed = line.trim()
    const cleanWord = trimmed.replace(/[:*]/g, '').trim().toUpperCase()

    // Make the first product name line bold
    if (idx === 0 && trimmed.length > 0 && !trimmed.startsWith('•') && !trimmed.startsWith('**')) {
      return `**${trimmed}**`
    }

    // Convert section labels to bold
    if (headers.includes(cleanWord)) {
      const originalWord = trimmed.replace(/[:*]/g, '').trim()
      return `\n**${originalWord}:**`
    }

    return line
  })

  return formatted.join('\n')
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, watch, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_featured: false, is_published: false, sort_order: 0 },
  })

  const nameValue = watch('name')

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          const d = data as Record<string, unknown>
          ;(Object.keys(schema.shape) as (keyof FormData)[]).forEach(k => {
            if (k in d) setValue(k, d[k] as never)
          })
          if (d.image_path) setImagePreview(d.image_path as string)
        }
      })
    }
  }, [id, isNew, setValue])

  useEffect(() => {
    if (isNew && nameValue) setValue('slug', slugify(nameValue))
  }, [nameValue, isNew, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    return data.publicUrl
  }

  // Quick insertion helpers for textarea
  const insertText = (fieldName: 'description' | 'usage_information', snippet: string) => {
    const current = getValues(fieldName) || ''
    const separator = current && !current.endsWith('\n') ? '\n' : ''
    setValue(fieldName, `${current}${separator}${snippet}`)
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setError(null)
    let imagePath = imagePreview
    if (imageFile) {
      imagePath = await uploadImage(imageFile)
      if (!imagePath) { setError('Image upload failed.'); setSaving(false); return }
    }

    // Auto-formats text to bold before database insertion
    const payload = { 
      ...data, 
      description: autoFormatText(data.description),
      usage_information: autoFormatText(data.usage_information),
      image_path: imagePath 
    }

    if (isNew) {
      const { error: err } = await supabase.from('products').insert(payload as any)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('products').update(payload as any).eq('id', id!)
      if (err) { setError(err.message); setSaving(false); return }
    }
    navigate('/admin/products')
  }

  return (
    <div className="max-w-3xl pb-16">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Product' : 'Edit Product'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image */}
        <div className="bg-white rounded-xl border p-6">
          <Label className="mb-3 block font-semibold text-slate-800">Product Image</Label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <Upload className="h-8 w-8 text-gray-300" />}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 font-medium">
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

        {/* Basic info */}
        <div className="bg-white rounded-xl border p-6 space-y-5">
          <h2 className="font-bold text-slate-900 text-lg border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold text-slate-700">Product Name *</Label>
              <Input {...register('name')} className="mt-1 font-semibold" placeholder="e.g. GROWMAX" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label className="font-semibold text-slate-700">URL Slug *</Label>
              <Input {...register('slug')} className="mt-1 text-slate-600 font-mono text-sm" />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          <div>
            <Label className="font-semibold text-slate-700">Category *</Label>
            <Controller name="category_id" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
          </div>

          <div>
            <Label className="font-semibold text-slate-700">Short Description</Label>
            <Textarea {...register('short_description')} className="mt-1" rows={2} placeholder="One-line summary for cards..." />
          </div>

          {/* Full Description With Quick Bold Inserters */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="font-semibold text-slate-700">Full Description</Label>
              
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Quick Insert:</span>
                <button
                  type="button"
                  onClick={() => insertText('description', '**Benefits:**\n• ')}
                  className="px-2 py-0.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200"
                >
                  + Benefits
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '**Dose:**\n• ')}
                  className="px-2 py-0.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200"
                >
                  + Dose
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '• ')}
                  className="px-2 py-0.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 inline-flex items-center gap-1"
                >
                  <List className="w-3 h-3" /> Bullet
                </button>
              </div>
            </div>

            <Textarea 
              {...register('description')} 
              className="mt-1 font-mono text-sm leading-relaxed" 
              rows={8} 
              placeholder={`GROWMAX\n\n• Zyme, Humic And Seaweed\n\nBenefits\n• Stimulates flowering\n\nDose\n• As per crop requirement`}
            />
            <p className="text-[11px] text-slate-400">
              Tip: You can use the quick buttons above, or simply type <strong>Benefits</strong> and <strong>Dose</strong>—they will automatically be formatted in bold.
            </p>
          </div>

          {/* Usage Information With Inserter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-slate-700">Usage Information</Label>
              <button
                type="button"
                onClick={() => insertText('usage_information', '**Usage:**\n• ')}
                className="px-2 py-0.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200"
              >
                + Usage
              </button>
            </div>
            <Textarea 
              {...register('usage_information')} 
              className="mt-1 font-mono text-sm" 
              rows={3} 
              placeholder={`Usage\n• Recommendations are general and may vary according to crop.`}
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-slate-900 border-b pb-2">SEO Settings</h2>
          <div>
            <Label className="font-medium text-slate-700">SEO Title</Label>
            <Input {...register('seo_title')} className="mt-1" />
          </div>
          <div>
            <Label className="font-medium text-slate-700">SEO Meta Description</Label>
            <Textarea {...register('seo_description')} className="mt-1" rows={2} />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-slate-900 border-b pb-2">Visibility & Position</h2>
          
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-slate-50/60">
            <div>
              <p className="font-bold text-sm text-slate-900">Published Status</p>
              <p className="text-xs text-slate-500">Enable to make it immediately visible to website visitors</p>
            </div>
            <Controller name="is_published" control={control} render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-slate-50/60">
            <div>
              <p className="font-bold text-sm text-slate-900">Featured Highlight</p>
              <p className="text-xs text-slate-500">Pin to homepage product catalog carousel</p>
            </div>
            <Controller name="is_featured" control={control} render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )} />
          </div>

          <div>
            <Label className="font-semibold text-slate-700">Sort Order</Label>
            <Input type="number" {...register('sort_order', { valueAsNumber: true })} className="mt-1 w-28" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-200">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 shadow-sm">
            {saving ? 'Saving...' : isNew ? 'Create & Publish Product' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}