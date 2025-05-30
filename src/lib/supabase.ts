import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Simple Supabase client for OAuth and client-side operations
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey) 