import "server-only";
import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";

async function getUserRequired(supabase: SupabaseClient): Promise<User> {
  const userResponse = await supabase.auth.getUser();
  if (userResponse.error) throw userResponse.error;

  const { user } = userResponse.data;

  return user;
}

export const createClientOnServer = () => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            console.log("error in cookieStore.set", e instanceof Error);
          }
        },
        remove(name: string, options: CookieOptions) {
          console.log("on the server! ");
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options }); // the same as deleting a cookie
          } catch (e) {
            console.log("error in cookieStore.set", e instanceof Error);
          }

          /**
           * From NextJS docs:
           *
           * `Alternatively, you can set a new cookie with the same name and an empty value.`
           */
        },
      },
    },
  );

  return {
    supabase,
    cookieStore, // so that we don't need to import and call cookies() every time
    getUserRequired: () => {
      return getUserRequired(supabase);
    },
  } as const;
};
