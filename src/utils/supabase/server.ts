import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // During build, return a mock client if environment variables are missing
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('Missing Supabase credentials during build. Using mock client.');
      return {
        auth: {
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        },
        // Add other methods as needed for your app
      } as any;
    }
  }

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