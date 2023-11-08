import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("mood", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id"),
  first: text("first").notNull(),
  last: text("last").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  roleEnum: roleEnum("role").notNull().default("user"), // default is unnecessary since we use triggers to set the default
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
