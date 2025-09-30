import { createClient } from '@supabase/supabase-js'

// Cliente público (solo lectura)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Cliente admin (service role - full access)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_PRIVATE_KEY!
)