import { type NextRequest } from "next/server";
import { createMiddlewareClient } from "./supabase/middleware";

/**
 * Run this on every route
 */
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  await supabase.auth.getSession();

  isFrontend(request);
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware

  return response;
}

function isFrontend(req: NextRequest) {
  const isBackendRegex = /^\/(api|_next|favicon\.ico).*$/;
  const isBackend = isBackendRegex.test(req.nextUrl.pathname);

  const isFrontend = !isBackend;

  isFrontend && console.log(req.nextUrl.pathname);

  return isFrontend;
}
