import { createBrowserClient } from '@supabase/ssr'
import { createMockSupabaseClient } from './mockClient'
import { supabaseConfig } from '@/config/env'

export function createClient() {
  // Get Supabase credentials from environment or config
  const supabaseUrl = supabaseConfig.url;
  const supabaseKey = supabaseConfig.anonKey;
  
  // During build or when credentials are missing, return a mock client
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return createMockSupabaseClient();
    }
  }

  // Return real client when credentials are available
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
} 