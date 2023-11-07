import { pgSchema, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const supabaseUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email").notNull(),
  emailConfirmedAt: timestamp("email_confirmed_at", { mode: "date" }),
});

export type SupabaseAuthUser = typeof supabaseUsers.$inferSelect;
export type SupabaseAuthUserInsert = typeof supabaseUsers.$inferInsert;
