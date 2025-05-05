import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        // Add other methods as needed for your app
      } as any;
    }
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
} 