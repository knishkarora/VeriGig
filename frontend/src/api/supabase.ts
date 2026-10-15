import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize client if credentials are present, otherwise export null-safe proxy
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** The localStorage key used to persist the intended role across the OAuth redirect round-trip. */
export const OAUTH_PENDING_ROLE_KEY = 'verigig_oauth_pending_role';

/**
 * Trigger authentic Google OAuth sign in via Supabase (PKCE flow).
 * Persists the intended role to localStorage BEFORE the redirect so it
 * survives the round-trip through Google → Supabase → back to /auth.
 */
export async function signInWithGoogle(role: 'student' | 'employer' = 'student') {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend environment.'
    );
  }

  // Persist role BEFORE the redirect so it survives the OAuth round-trip.
  // ?role= in the redirectTo URL is stripped by Supabase when it sends back ?code=,
  // so localStorage is the only reliable carrier across the browser redirect.
  localStorage.setItem(OAUTH_PENDING_ROLE_KEY, role);

  // redirectTo must be a plain URL that is whitelisted in Supabase URL Configuration.
  const redirectUrl = `${window.location.origin}/auth`;

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
