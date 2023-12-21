"use server";

import { capitalizeAndFilter } from "@/lib/string-utils";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { PG_ERROR_CODES, isPgError } from "@/server/db/pg-utils";
import { createClientOnServer } from "@/supabase/server";
import { targets } from "drizzle/schema";
import type { useFormState } from "react-dom";
import { z } from "zod";

export type CreateTargetFormState =
  | null
  | {
      success: true;
      data: typeof targets.$inferSelect;
    }
  | {
      success: false;
      error: string | null;
    };

type ServerActionForFormState<T> = Parameters<
  typeof useFormState<T, FormData>
>[0];

export const createTarget: ServerActionForFormState<
  CreateTargetFormState
> = async (_curr, fd) => {
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
      return {
        success: false,
        error: `${name} already exists`,
      };
    } else throw e;
  }
  const [first] = result;

  if (result.length !== 1 || !first) throw new Error("impossible");

  return {
    success: true,
    data: first,
  };
};
