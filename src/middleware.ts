import { type NextRequest } from "next/server";
import { createMiddlewareClient } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const session = await supabase.auth.getSession();
  // console.log("session in middleware", session);

  return response;

  // try {
  //   // This `try/catch` block is only here for the interactive tutorial.
  //   // Feel free to remove once you have Supabase connected.
  //   const { supabase, response } = createClient(request);

  //   // Refresh session if expired - required for Server Components
  //   // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  //   await supabase.auth.getSession();

  //   return response;
  // } catch (e) {
  //   // If you are here, a Supabase client could not be created!
  //   // This is likely because you have not set up environment variables.
  //   // Check out http://localhost:3000 for Next Steps.
  //   return NextResponse.next({
  //     request: {
  //       headers: request.headers,
  //     },
  //   });
  // }
}
