import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  text,
  unique,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const role = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  first: text("first"),
  last: text("last"),
  role: role("role"),
});

export const gyms = pgTable(
  "gyms",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 20 }).notNull(),
    uid: uuid("uid")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      gymsNameUidKey: unique("gyms_name_uid_key").on(table.name, table.uid),
    };
  },
);
