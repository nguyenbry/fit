import {
  pgTable,
  unique,
  pgEnum,
  serial,
  text,
  boolean,
  timestamp,
  uuid,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

export const workoutType = pgEnum("workout_type", ["uni", "bi"]);
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
export const role = pgEnum("role", ["user", "admin"]);

export const targets = pgTable(
  "targets",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    verified: boolean("verified").default(false).notNull(),
  },
  (table) => {
    return {
      tagsNameKey: unique("tags_name_key").on(table.name),
    };
  },
);

export const movements = pgTable(
  "movements",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    verified: boolean("verified").default(false).notNull(),
    type: workoutType("type"),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      movementsNameKey: unique("movements_name_key").on(table.name),
    };
  },
);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  first: text("first"),
  last: text("last"),
});

export const gyms = pgTable(
  "gyms",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
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

export const targetMovement = pgTable(
  "target_movement",
  {
    target: integer("target")
      .notNull()
      .references(() => targets.id, { onDelete: "cascade" }),
    movement: integer("movement")
      .notNull()
      .references(() => movements.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(false).notNull(),
  },
  (table) => {
    return {
      tagAssociationsPkey: primaryKey({
        columns: [table.target, table.movement],
        name: "tag_associations_pkey",
      }),
    };
  },
);
