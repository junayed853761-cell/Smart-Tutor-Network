import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// If credentials are provided, create real Supabase client; otherwise null (will fallback to localStorage / mock repo)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export async function diagnoseSupabaseConnection(): Promise<{ success: boolean; error?: any; details?: string }> {
  console.log('[Supabase Diagnostics] Initializing connection test to URL:', supabaseUrl || '(not configured)');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    const msg = '[Supabase Diagnostics] FAILED: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined in environment variables.';
    console.error(msg);
    return { success: false, details: msg };
  }

  if (!supabase) {
    const msg = '[Supabase Diagnostics] FAILED: Supabase client instance could not be created.';
    console.error(msg);
    return { success: false, details: msg };
  }

  try {
    const startTime = performance.now();
    const { data, error, status, statusText } = await supabase.from('categories').select('id').limit(1);
    const duration = Math.round(performance.now() - startTime);

    if (error) {
      console.error(`[Supabase Diagnostics] ERROR: Query failed with HTTP status ${status} (${statusText}) in ${duration}ms.`);
      console.error('[Supabase Diagnostics] Error details:', error);
      if (error.code === '42501') {
        console.warn('[Supabase Diagnostics] HINT: Error 42501 indicates Row Level Security (RLS) is blocking access. Run `ALTER TABLE categories DISABLE ROW LEVEL SECURITY;` or create public policies in your Supabase SQL Editor.');
      } else if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('[Supabase Diagnostics] HINT: Table does not exist. Please run the SQL migration script from the SqlSchemaViewer page in your Supabase SQL Editor.');
      }
      return { success: false, error, details: error.message };
    }

    console.log(`[Supabase Diagnostics] SUCCESS: Connected to Supabase successfully in ${duration}ms. Tables are reachable and responsive.`);
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Diagnostics] EXCEPTION caught during connection test:', err);
    return { success: false, error: err, details: err?.message || String(err) };
  }
}

