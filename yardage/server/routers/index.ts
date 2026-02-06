import { router } from "../trpc";
import { userRouter } from "./user";

/**
 * Main app router - combines all sub-routers.
 * Add new routers here as your app grows.
 */
export const appRouter = router({
  user: userRouter,
});

/**
 * Export the type definition of the API.
 * This is used on the client side to infer types.
 * ONLY export the type — never the router instance to the client!
 */
export type AppRouter = typeof appRouter;
