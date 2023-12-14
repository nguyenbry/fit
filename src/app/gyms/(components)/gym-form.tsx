import type { PropsWithCn } from "@/lib/types";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "../../../components/ui/button";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { gyms } from "drizzle/schema";
import { z } from "zod";
import { createClientOnServer } from "@/supabase/server";
import {
  PG_ERROR_CODES,
  getHandlePgErrorOrRethrow,
} from "@/server/db/pg-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/app/app-routes";

/**
 * TODO: Ensure user has set their name and other required fields
 * otherwise redirect them to that setup page
 */

export function GymForm({ className }: PropsWithCn) {
  const createGym = async (formData: FormData) => {
    "use server";

    const { getSupabaseUserRequired: getUserRequired } = createClientOnServer();
    const { id: uid } = await getUserRequired();

    await drizzyDrake
      .insert(gyms)
      .values({
        name: z.string().parse(formData.get("name")),
        uid,
      })
      .then(() => {
        revalidatePath(APP_ROUTES.GYMS);
      })
      .catch(
        getHandlePgErrorOrRethrow((pgErr) => {
          if (pgErr.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
            // a user can only have one gym with a given name
            const s = new URLSearchParams({
              message: `You already have a gym with this name`,
            }).toString();
            redirect(`${APP_ROUTES.GYMS}?${s}`);
          }

          throw pgErr; // only handle what I know about right now
        }),
      );
  };

  return (
    <form className={cn(className)} action={createGym}>
      <Label htmlFor="name">Name</Label>
      <Input id="name" autoComplete="off" name="name" />

      <div className="mt-4 flex justify-end">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
