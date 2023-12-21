"use server";
import { z } from "zod";
import type { Movement, MovementType } from "./types";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { movements } from "drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { APP_ROUTES } from "../app-routes";

export type UpdateMovementTypeFormState = {
  message: string | null;
  id: Movement["id"];
};

export const updateMovementType = async (
  state: UpdateMovementTypeFormState,
  fd: FormData,
) => {
  const { id } = state;
  const type = z.string().parse(fd.get("type")) as NonNullable<MovementType>;

  const result = await drizzyDrake
    .update(movements)
    .set({ type })
    .where(eq(movements.id, id))
    .returning({ updatedId: movements.id });

  if (result.length === 0) {
    console.log(result, { type, id }, "result");
    throw new Error("No rows were updated");
  } else {
    revalidatePath(APP_ROUTES.MOVEMENTS);

    const out: UpdateMovementTypeFormState = {
      message: `Updated movement type to ${type}`,
      id,
    };
    return out;
  }
};
