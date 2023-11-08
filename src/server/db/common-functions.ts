import { eq } from "drizzle-orm";
import { drizzyDrake } from "./drizzy-drake";
import { users } from "./public/users";

export const getProfileById = (supabaseId: string) => {
  return drizzyDrake.query.users.findFirst({
    where: eq(users.id, supabaseId),
  });
};
