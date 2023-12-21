import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { desc } from "drizzle-orm";
import { targets } from "drizzle/schema";

export const targetsRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({}) => {
    return await drizzyDrake.query.targets.findMany({
      orderBy: desc(targets.id),
    });
  }),
});
