import type { movements } from "drizzle/schema";

export type Movement = typeof movements.$inferSelect;

export type MovementType = Movement["type"];
