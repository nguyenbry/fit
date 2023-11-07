import { createClientOnServer } from "@/supabase/server";
import { z } from "zod";

export default async function ProfileSetup() {
  const [supabase] = createClientOnServer();

  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data.user) {
    return <div>Not logged in</div>;
  }

  const email = z.string().parse(data.user.email);

  return <div>{email}</div>;
}
