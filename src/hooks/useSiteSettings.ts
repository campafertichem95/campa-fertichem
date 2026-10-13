import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteSetting } from '@/types/database'

type Settings = Record<string, string>

export function useSiteSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .then(({ data }) => {
        if (data) {
          const map: Settings = {}
          data.forEach((s: Pick<SiteSetting, 'setting_key' | 'setting_value'>) => {
            if (s.setting_value) map[s.setting_key] = s.setting_value
          })
          setSettings(map)
        }
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}
