"use server";

import type { Movement } from "@/app/movements/types";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { createClientOnServer } from "@/supabase/server";
import { movements } from "drizzle/schema";
import { z } from "zod";

export async function createMovement(fd: FormData) {
  const { isAdmin } = createClientOnServer();

  if (!(await isAdmin())) throw new Error("Unauthorized");

  await drizzyDrake.insert(movements).values({
    name: z
      .string()
      .trim()
      .parse(fd.get("name" satisfies keyof Movement)),
    type: "uni",
  });
}
