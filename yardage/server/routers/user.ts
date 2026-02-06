import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

/**
 * User router - handles user-related procedures.
 * Add your user-related queries and mutations here.
 */
export const userRouter = router({
  /**
   * Get the current authenticated user's session info.
   * Requires authentication.
   */
  getSession: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  /**
   * Public health check endpoint.
   * No authentication required.
   */
  healthCheck: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date() };
  }),
});
