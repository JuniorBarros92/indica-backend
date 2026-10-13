
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local.'
  )
}

try {
  const url = new URL(supabaseUrl)
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new Error()
  }
} catch {
  throw new Error(
    'VITE_SUPABASE_URL inválida. Use a Project URL do projeto Supabase (ex.: https://<project-ref>.supabase.co).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
