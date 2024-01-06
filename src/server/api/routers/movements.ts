import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { desc, eq } from "drizzle-orm";
import {
  movements,
  movements as movementsTable,
  targetMovement,
  targets,
} from "drizzle/schema";
import { z } from "zod";

export const movementsRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({}) => {
    const movements = await drizzyDrake.query.movements.findMany({
      orderBy: desc(movementsTable.updatedAt),
    });

    return movements;
  }),
  getTargets: adminProcedure
    .input(z.number().int())
    .query(async ({ input: movementId }) => {
      // return await drizzyDrake.query.targetMovement.findMany({
      //   where: (table, { eq }) => eq(table.movement, movementId),
      // });

      return await drizzyDrake
        .select({
          name: targets.name,
          id: targets.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } satisfies Partial<Record<keyof typeof targets.$inferSelect, any>>)
        .from(movements)
        .where(eq(movements.id, movementId))
        .innerJoin(targetMovement, eq(movements.id, targetMovement.movement))
        .innerJoin(targets, eq(targetMovement.target, targets.id));
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
});
