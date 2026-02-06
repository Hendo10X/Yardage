import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { auth } from "../lib/auth";
import { db } from "../db/drizzle";
import { store } from "../db/schema";

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

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  return next({ ctx: { session: ctx.session, user: ctx.user } });
});

export const sellerProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const [userStore] = await db
      .select()
      .from(store)
      .where(eq(store.userId, ctx.user.id))
      .limit(1);

    if (!userStore) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must create a store first",
      });
    }

    return next({ ctx: { ...ctx, store: userStore } });
  },
);
