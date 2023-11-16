import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileById } from "@/server/db/common-functions";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { users } from "@/server/db/schema";
import { createClientOnServer } from "@/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

type InputFieldNames = "first" | "last" | "email";

const inputFieldNames: { [T in InputFieldNames]: T } = {
  first: "first",
  last: "last",
  email: "email",
};

export default async function ProfileSetup() {
  const [supabase] = createClientOnServer();
  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data.user) return <div>Not logged in</div>;

  const profile = await getProfileById(data.user.id);

  const shouldNotSeeSetup = profile?.first && profile?.last;
  shouldNotSeeSetup && redirect("/");

  const email = z.string().parse(data.user.email);

  async function create(formData: FormData) {
    "use server";
    const nameValidator = z.string().trim().min(2);
    const firstName = nameValidator.parse(formData.get("first"));
    const lastName = nameValidator.parse(formData.get("last"));

    const [supabase] = createClientOnServer();

    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    const { id } = data.user;

    await drizzyDrake
      .update(users)
      .set({
        first: firstName.toLowerCase(),
        last: lastName.toLowerCase(),
      })
      .where(eq(users.id, id));

    redirect("/");
  }

  return (
    <div>
      <form action={create}>
        <div>
          <Label htmlFor={inputFieldNames.email}>Email</Label>
          <Input id={inputFieldNames.email} disabled value={email} />
        </div>
        <div>
          <Label htmlFor={inputFieldNames.first}>First Name</Label>
          <Input
            id={inputFieldNames.first}
            name={inputFieldNames.first}
            required
            minLength={2}
          />
        </div>
        <div>
          <Label htmlFor={inputFieldNames.last}>Last Name</Label>
          <Input
            id={inputFieldNames.last}
            name={inputFieldNames.last}
            required
            minLength={2}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
