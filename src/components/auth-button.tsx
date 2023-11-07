import Link from "next/link";
import { redirect } from "next/navigation";
import { createClientOnServer } from "@/supabase/server";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const [supabase] = createClientOnServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const [supabase] = createClientOnServer();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link href="/login">
      <Button>Log In</Button>
    </Link>
  );
}
