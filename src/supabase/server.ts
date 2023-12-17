import "server-only";
import { env } from "@/env.mjs";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { eq } from "drizzle-orm";
import { users } from "drizzle/schema";
import { supabaseUserRole } from "drizzle/auth-session-role";

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
          } catch {
            // called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options }); // the same as deleting a cookie
          } catch {
            // called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
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

  const getAuthSession = async () => {
    const userResponse = await supabase.auth.getSession();

    if (userResponse.error) throw userResponse.error;

    const { session } = userResponse.data;

    if (!session) return undefined;

    return {
      ...session,
      user: {
        ...session.user,
        role: supabaseUserRole.parse(session.user.role),
      },
    };
  };

  const getAppUserRequired = async () => {
    const session = await getAuthSession();

    if (!session) throw new Error("Session not found");
    const uid = session.user.id;
    const profile = await drizzyDrake.query.users.findFirst({
      where: eq(users.id, uid),
    });

    if (!profile) throw new Error("User not found");
    return profile;
  };

  const isAdmin = async () => {
    const session = await getAuthSession();
    if (!session) throw new Error("Session not found");
    return session.user.role === supabaseUserRole.Enum.my_admin;
  };

  return {
    supabase,
    cookieStore, // so that we don't need to import and call cookies() every time
    getAuthSession,
    getAppUserRequired,
    isAdmin,
  } as const;
};
