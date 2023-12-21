"use server";

import type { Movement } from "@/app/movements/types";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { createClientOnServer } from "@/supabase/server";
import { eq } from "drizzle-orm";
import { movements, targets } from "drizzle/schema";
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

// class CustomError extends Error {
//   constructor(
//     message: string,
//     public code: number,
//   ) {
//     super(message);
//     this.name = "CustomError";
//   }
// }

export async function deleteTarget(id: (typeof targets.$inferSelect)["id"]) {
  const { isAdmin } = createClientOnServer();

  if (!(await isAdmin())) throw new Error("Unauthorized");

  const result = await drizzyDrake
    .delete(targets)
    .where(eq(targets.id, id))
    .returning({
      deletedId: targets.id,
    });

  if (result.length === 0) {
    return false;
  }
  return true;
}
