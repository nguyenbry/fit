import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // matches the id from supabase
  first: text("first").notNull(),
  last: text("last").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
