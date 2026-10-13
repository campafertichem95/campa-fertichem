import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  product_id: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

// Encoded address for Google Maps
const MAP_QUERY = encodeURIComponent('CAMPA FERTICHEM B201 Devdrishti CHS Plot No 62 Navade Phase 2 Taloja Navi Mumbai')
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&t=&z=16&ie=UTF8&iwloc=&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const preselectedProduct = searchParams.get('product') || ''

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { product_id: preselectedProduct },
  })

  useEffect(() => {
    supabase.from('products').select('id, name').eq('is_published', true).order('name').then(({ data }) => {
      if (data) setProducts(data as Product[])
    })
  }, [])

  useEffect(() => {
    if (preselectedProduct) setValue('product_id', preselectedProduct)
  }, [preselectedProduct, setValue])

  const onSubmit = async (data: FormData) => {
    setError(null)
    const { error: err } = await supabase.from('enquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      product_id: data.product_id || null,
      message: data.message,
      status: 'new',
    } as any)
    if (err) {
      setError('Failed to send your enquiry. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Sent!</h2>
          <p className="text-gray-600">Thank you for reaching out. Our team will get back to you shortly.</p>
          <Button className="mt-6 bg-green-700 hover:bg-green-800" onClick={() => setSubmitted(false)}>
            Send Another Enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-green-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
          <p className="text-green-200 mt-2">Get in touch with our team for product enquiries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 text-sm">
                Have questions about our fertilizer products? Fill out the form and our team will respond promptly.
              </p>
            </div>
            {[
              {
                icon: MapPin,
                label: 'Address',
                value: 'B201 Devdrishti CHS, Plot No. 62, Navade Phase 2, Taloja, Navi Mumbai',
              },
              { icon: Phone, label: 'Phone',          value: '+91 XXXXX XXXXX',          href: 'tel:+91XXXXXXXXXX' },
              { icon: Mail,  label: 'Email',          value: 'info@campafertichem.com',  href: 'mailto:info@campafertichem.com' },
              { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM' },
            ].map(({ icon: Icon, label, value, href }: any) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-gray-700 hover:text-green-700 transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Directions button */}
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 border border-green-700 rounded-lg px-4 py-2 hover:bg-green-50 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send an Enquiry</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...register('name')} className="mt-1" placeholder="Your name" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register('email')} className="mt-1" placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} className="mt-1" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <Label htmlFor="company">Company / Farm Name</Label>
                  <Input id="company" {...register('company')} className="mt-1" placeholder="Optional" />
                </div>
              </div>
              <div>
                <Label htmlFor="product">Product of Interest</Label>
                <Select onValueChange={val => setValue('product_id', val)} defaultValue={preselectedProduct}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a product (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  className="mt-1"
                  rows={5}
                  placeholder="Describe your requirements..."
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-green-700 hover:bg-green-800">
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </Button>
            </form>
          </div>
        </div>

        {/* ── Map Section ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Map header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Campa Fertichem</p>
                <p className="text-xs text-gray-500">B201 Devdrishti CHS, Plot No. 62, Navade Phase 2, Taloja, Navi Mumbai</p>
              </div>
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-50 transition-colors"
            >
              Open in Google Maps <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Embedded map */}
          <div className="relative w-full h-[420px] bg-gray-100">
            <iframe
              title="Campa Fertichem Location"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Mobile directions link */}
          <div className="sm:hidden px-6 py-3 border-t border-gray-100">
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
            >
              Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
