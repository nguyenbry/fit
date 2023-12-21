"use server";

import type { Movement } from "@/app/movements/types";
import { createErrorAsMyActionError } from "@/lib/action-error";
import { capitalizeAndFilter } from "@/lib/string-utils";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { PG_ERROR_CODES, isPgError } from "@/server/db/pg-utils";
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

export async function createTarget(fd: FormData) {
  const { isAdmin } = createClientOnServer();

  if (!(await isAdmin())) throw new Error("Unauthorized");

  const raw = z
    .string()
    .min(3)
    .parse(fd.get("name" satisfies keyof typeof targets.$inferSelect));
  const name = capitalizeAndFilter(raw);

  let result;

  try {
    result = await drizzyDrake
      .insert(targets)
      .values({
        name,
        verified: true,
      })
      .returning(); // get the row back
  } catch (e) {
    // I want to throw everything so the client can see it
    if (isPgError(e) && e.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
      throw createErrorAsMyActionError(`${name} already exists`);
    } else throw e;
  }
  const [first] = result;

  if (result.length !== 1 || !first) throw new Error("impossible");

  return first;
}

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
