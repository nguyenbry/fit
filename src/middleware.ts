import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "./supabase/middleware";
import { APP_ROUTES, REQUIRES_AUTH_MAP, ADMIN_PATHS } from "./app/app-routes";
import { supabaseUserRole } from "drizzle/auth-session-role";

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Run this on every route
 */
export async function middleware(request: NextRequest) {
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { supabase, response } = createMiddlewareClient(request);

  // The getSession function must be called for any Server Component routes that use a Supabase client.

  const isFend = isFrontend(request);

  const pathname = request.nextUrl.pathname;

  if (!isFend) return response;

  const pageRequiresAuth =
    Object.entries(REQUIRES_AUTH_MAP).find(([beginningPath]) => {
      return pathname.startsWith(beginningPath);
    })?.[1] ?? false;

  if (!pageRequiresAuth) return response;

  const { data, error } = await supabase.auth.getSession();

  const red = NextResponse.redirect(getBaseUrl() + APP_ROUTES.LOGIN);

  if (error) return red;
  if (!data.session) return red;

  const isAdminOnly = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (!isAdminOnly) return response;

  const { user } = data.session;

  const isAdmin = supabaseUserRole.parse(user.role) === "my_admin";

  if (!isAdmin) return red;

  return response;
}

function isFrontend(req: NextRequest) {
  const {
    nextUrl: { pathname },
  } = req;
  const isBackendRegex = /^\/(api|_next|favicon\.ico).*$/;
  const isBackend = isBackendRegex.test(pathname);

  const isFrontend = !isBackend;

  isFrontend && console.log("frontend request:", { pathname });

  return isFrontend;
}
