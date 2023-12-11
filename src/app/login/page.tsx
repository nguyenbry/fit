import { headers } from "next/headers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClientOnServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import { supabaseServiceRole } from "@/supabase/service-role";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabaseUsers, users } from "@/server/db/schema";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { eq } from "drizzle-orm";
import { z } from "zod";

export default function Login({ searchParams }: { searchParams: unknown }) {
  const redirectWithMessage = async (message: string) => {
    "use server";
    await Promise.resolve(); // stupid
    const s = new URLSearchParams({ message }).toString();
    return redirect(`/login?${s}`);
  };

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { supabase } = createClientOnServer();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";
    const origin = headers().get("origin");
    const options = {
      emailRedirectTo: `${origin}/auth/callback`, // our route handler
    };

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { supabase } = createClientOnServer();

    const existing = await drizzyDrake.query.supabaseUsers.findFirst({
      where: eq(supabaseUsers.email, email),
    });

    if (existing) {
      const profile = await drizzyDrake.query.users.findFirst({
        where: eq(users.id, existing.id),
      });

      if (profile) return redirectWithMessage("Please log in instead");
      // they need to confirm email

      // send another email
      const emailSendResult = await supabase.auth.resend({
        email,
        options,
        type: "signup",
      });

      if (emailSendResult.error) {
        // TODO: handle error
        if (emailSendResult.error.status === 429)
          return redirectWithMessage("Please try again in a few minutes");
        else {
          return redirectWithMessage(
            "Error authenticating. Resending email issue",
          );
        }
      }

      // redirect them back to login page with a message to check their email
      return redirectWithMessage(
        "Check your email to continue sign in process",
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    const allUsersRequest = await supabaseServiceRole.auth.admin.listUsers();

    if (error ?? allUsersRequest.error) {
      console.log("Error signing up user", error);
      return redirectWithMessage("Error authenticating");
    }
    return redirectWithMessage("Check your email to continue sign in process");
  };

  const parsedSp = z
    .object({ message: z.string().trim().min(1) })
    .safeParse(searchParams);

  return (
    <div className="inline-flex w-3/4 gap-10 rounded-lg border bg-white p-24 shadow-lg animate-in fade-in-25 spin-in-2 slide-in-from-top-5 dark:bg-card">
      <div className="inline-flex w-1/2 flex-col gap-8">
        <span className="block text-2xl tracking-tight">Welcome Back</span>
        <span className="break-words text-6xl font-semibold tracking-tight text-black dark:text-white">
          The only fitness tracker you need.
        </span>
      </div>

      <form
        className="flex w-full flex-1 flex-col items-center justify-center gap-2 text-foreground animate-in"
        action={signIn}
      >
        {parsedSp.success && (
          <Alert className="mb-10 animate-in slide-in-from-top-5">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{parsedSp.data.message}</AlertDescription>
          </Alert>
        )}
        <Label className="w-full" htmlFor="email">
          Email
        </Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label className="w-full" htmlFor="password">
          Password
        </Label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button variant={"link"} className="ml-auto px-0">
          Forgot Password?
        </Button>
        <Button className="w-full" variant={"secondary"}>
          Sign In
        </Button>
        <Button formAction={signUp} variant={"default"} className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
