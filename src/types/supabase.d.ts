declare module '@supabase/ssr' {
  import { SupabaseClient } from '@supabase/supabase-js';

  export function createBrowserClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient;

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient;
} 