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
      throw error ?? allUsersRequest.error;
    }
    return redirectWithMessage("Check your email to continue sign in process");
  };

  const parsedSp = z
    .object({ message: z.string().trim().min(1) })
    .safeParse(searchParams);

  return (
    <div className="mb-12 inline-flex w-[90%] grow flex-col gap-10 rounded-lg border bg-white p-4 shadow-lg animate-in fade-in-25 spin-in-2 slide-in-from-top-5 dark:bg-card lg:flex-grow-0 lg:flex-row lg:p-8 xl:w-3/4 xl:p-24">
      <div className="inline-flex flex-col lg:w-1/2 lg:gap-8">
        <span className="block text-2xl tracking-tight">Welcome Back</span>
        <span className="break-words text-4xl font-semibold tracking-tight text-black dark:text-white md:text-5xl xl:text-6xl">
          The only fitness tracker you need.
        </span>
      </div>

      <form
        className="mt-10 flex w-full flex-1 flex-col items-center gap-2 text-foreground animate-in lg:mt-0 lg:justify-center"
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
