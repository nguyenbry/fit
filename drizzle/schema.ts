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

export const role = pgEnum("role", ["user", "admin"]);
export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn"]);

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
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      gymsNameUidKey: unique("gyms_name_uid_key").on(table.name, table.uid),
    };
  },
);
