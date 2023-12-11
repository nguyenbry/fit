import { createClientOnServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const signOut = async () => {
    "use server";

    const { supabase } = createClientOnServer();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <form action={signOut}>
      <Button size="icon" variant={"outline"}>
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  );
}
