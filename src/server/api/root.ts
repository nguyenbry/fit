import { postRouter } from "@/server/api/routers/post";
import { movementsRouter } from "./routers/movements";
import { targetsRouter } from "./routers/targets";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  movements: movementsRouter,
  targets: targetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
