import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createMockSupabaseClient } from './mockClient'
import { supabaseConfig } from '@/config/env'

export function createClient() {
  const cookieStore = cookies()
  const supabaseUrl = supabaseConfig.url;
  const supabaseKey = supabaseConfig.anonKey;
  
  // During build or when credentials are missing, return a mock client
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return createMockSupabaseClient();
    }
  }

  // Return real client when credentials are available
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { expires?: Date; path?: string; domain?: string; secure?: boolean }) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: { expires?: Date; path?: string; domain?: string; secure?: boolean }) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
} 