import { env } from "@/env.mjs";
import { createBrowserClient as createBrowserClient_ } from "@supabase/ssr";

export const createBrowserClient = () =>
  createBrowserClient_(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
