import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize client if credentials are present, otherwise export null-safe proxy
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Trigger authentic Google OAuth sign in via Supabase
 */
export async function signInWithGoogle(role: 'student' | 'employer' = 'student') {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend environment.'
    );
  }

  // Preserve the intended role in query parameters so upon return the user is routed to the right dashboard
  const redirectUrl = `${window.location.origin}/auth?provider=google&role=${role}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
