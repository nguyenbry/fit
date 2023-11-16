import { headers } from "next/headers";
import { createClientOnServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import { supabaseServiceRole } from "@/supabase/service-role";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const [supabase] = createClientOnServer();

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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const [supabase] = createClientOnServer();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`, // our route handler
      },
    });

    const allUsersRequest = await supabaseServiceRole.auth.admin.listUsers();

    if (error ?? allUsersRequest.error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="inline-flex w-3/4 gap-10 rounded-lg border bg-white dark:bg-card p-24 shadow-lg animate-in slide-in-from-top-5 spin-in-2 fade-in-25">
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
        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
