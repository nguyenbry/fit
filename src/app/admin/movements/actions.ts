"use server";

import type { Movement } from "@/app/movements/types";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { createClientOnServer } from "@/supabase/server";
import { eq } from "drizzle-orm";
import { movements, targetMovement, targets } from "drizzle/schema";
import { z } from "zod";
import * as FormDataKeys from "../targets/formdata-keys";

export async function createMovement(fd: FormData) {
  const { isAdmin } = createClientOnServer();

  if (!(await isAdmin())) throw new Error("Unauthorized");

  const associatedTargetIds = z.coerce
    .number()
    .int()
    .array()
    .parse(fd.getAll(FormDataKeys.TARGETS_STRING_ARRAY));

  const [first] = await drizzyDrake
    .insert(movements)
    .values({
      name: z
        .string()
        .trim()
        .parse(fd.get("name" satisfies keyof Movement)),
      type: "uni",
    })
    .returning({
      id: movements.id,
    });
  if (!first) throw new Error("impossible");

  if (associatedTargetIds.length > 0) {
    await drizzyDrake.insert(targetMovement).values(
      associatedTargetIds.map((targetId) => {
        return {
          movement: first.id,
          target: targetId,
        };
      }),
    );
  }
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
