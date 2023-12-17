import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "./supabase/middleware";
import { APP_ROUTES, REQUIRES_AUTH_MAP } from "./app/app-routes";

const isAuthMapKey = (key: string): key is keyof typeof REQUIRES_AUTH_MAP => {
  return key in REQUIRES_AUTH_MAP;
};

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
    isAuthMapKey(pathname) && REQUIRES_AUTH_MAP[pathname];

  if (!pageRequiresAuth) return response;

  const { data, error } = await supabase.auth.getSession();
  const badOrNoSession = error ?? !data.session;
  // check session
  const allGood = !badOrNoSession;
  if (allGood) return response;
  console.log("redirecting to login because auth is required", { pathname });
  return NextResponse.redirect(getBaseUrl() + APP_ROUTES.LOGIN);
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
