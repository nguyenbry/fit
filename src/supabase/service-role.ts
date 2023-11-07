import { env } from "@/env.mjs";
import { createClient } from "@supabase/supabase-js";

/**
 * From https://supabase.com/docs/reference/javascript/admin-api/
 */
export const supabaseServiceRole = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
