import { postRouter } from "@/server/api/routers/post";
import { movementsRouter } from "./routers/movements";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  movements: movementsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
