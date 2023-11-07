import "server-only";
import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cookieStore.set({ name, value, ...options });
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

  return [supabase, cookieStore] as const; // so that we don't need to import and call cookies() every time
};
