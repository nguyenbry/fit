import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env.mjs";
import { users } from "./users";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);
export const drizzyDrake = drizzle(client, {
  schema: { users },
});
