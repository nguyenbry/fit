import Link from "next/link";
import { createClientOnServer } from "@/supabase/server";
import { Button } from "./ui/button";
import { SignOutButton } from "./sign-out-button";

export default async function AuthButton() {
  const { supabase } = createClientOnServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <SignOutButton />
    </div>
  ) : (
    <Link href="/login">
      <Button>Log In</Button>
    </Link>
  );
}
