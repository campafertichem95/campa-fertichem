import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SETTINGS_KEYS = [
  { key: 'company_name', label: 'Company Name', type: 'text' },
  { key: 'hero_video_url', label: 'Hero Video URL', type: 'text' },
  { key: 'hero_poster_url', label: 'Hero Poster Image URL', type: 'text' },
  { key: 'hero_heading', label: 'Hero Heading', type: 'text' },
  { key: 'hero_subtext', label: 'Hero Supporting Text', type: 'text' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', type: 'text' },
  { key: 'contact_address', label: 'Contact Address', type: 'textarea' },
  { key: 'business_hours', label: 'Business Hours', type: 'text' },
  { key: 'footer_tagline', label: 'Footer Tagline', type: 'text' },
  { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
  { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
  { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text' },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('setting_key, setting_value').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        ;(data as any[]).forEach((s: any) => { if (s.setting_value) map[s.setting_key] = s.setting_value })
        setValues(map)
      }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await Promise.all(
      SETTINGS_KEYS.map(({ key }) =>
        supabase.from('site_settings').upsert(
          { setting_key: key, setting_value: values[key] ?? '' } as any,
          { onConflict: 'setting_key' }
        )
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        {SETTINGS_KEYS.map(({ key, label, type }) => (
          <div key={key}>
            <Label>{label}</Label>
            {type === 'textarea' ? (
              <Textarea
                className="mt-1"
                rows={3}
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
              />
            ) : (
              <Input
                className="mt-1"
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button onClick={handleSave} disabled={saving} className="bg-green-700 hover:bg-green-800">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        {saved && <span className="text-sm text-green-700 font-medium">✓ Settings saved</span>}
      </div>
    </div>
  )
}
