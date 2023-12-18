import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { desc } from "drizzle-orm";
import { movements as movementsTable } from "drizzle/schema";

export const movementsRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({}) => {
    const movements = await drizzyDrake.query.movements.findMany({
      orderBy: desc(movementsTable.updatedAt),
    });

    return movements;
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
