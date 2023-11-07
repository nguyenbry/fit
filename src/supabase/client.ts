import { createBrowserClient as createBrowserClient_ } from "@supabase/ssr";

export const createBrowserClient = () =>
  createBrowserClient_(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
