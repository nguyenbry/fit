import Link from "next/link";
import { createClientOnServer } from "@/supabase/server";
import { Button } from "./ui/button";
import { SignOutButton } from "./sign-out-button";

export default async function AuthButton() {
  const { supabase } = createClientOnServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? (
    <div className="flex items-center gap-4">
      Hey, {session.user.email}
      <SignOutButton />
    </div>
  ) : (
    <Link href="/login">
      <Button>Log In</Button>
    </Link>
  );
}
