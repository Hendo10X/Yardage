import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { auth } from "../lib/auth";

/**
 * Create context for each tRPC request.
 * Extracts the better-auth session from request headers/cookies.
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    session,
    user: session?.user ?? null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC - this should only be done once per backend.
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Reusable exports
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public (unauthenticated) procedure
 * Any user can call these procedures, whether logged in or not.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 * Only authenticated users can call these procedures.
 * Automatically injects the session and user into the context.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
    },
  });
});
