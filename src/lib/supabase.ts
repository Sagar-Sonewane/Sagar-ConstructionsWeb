import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
  );
}

// Public client for client-side and general insertions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client using service_role key to securely bypass RLS
export const getSupabaseAdmin = () => {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin can only be used on the server side!");
  }
  
  if (!supabaseServiceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon client.");
    return supabase;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
