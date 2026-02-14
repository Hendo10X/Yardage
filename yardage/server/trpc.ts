import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { auth } from "../lib/auth";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";
import { store } from "../db/schema";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    session,
    user: session?.user
      ? {
          ...session.user,
          role: (session.user as any).role as "USER" | "SELLER",
          universityId: (session.user as any).universityId as string | undefined,
        }
      : null,
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

export const vendorProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // If user has a store, they are a vendor even if their role is still "USER"
    const [userStore] = await db
      .select()
      .from(store)
      .where(eq(store.userId, ctx.user.id))
      .limit(1);

    if (!userStore) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must create a store before you can post products",
      });
    }

    // Sync role if it's not set correctly
    if (ctx.user.role !== "SELLER") {
      await db
        .update(schema.user)
        .set({ role: "SELLER" })
        .where(eq(schema.user.id, ctx.user.id));
      
      ctx.user.role = "SELLER";
    }

    return next({ ctx: { ...ctx, store: userStore } });
  },
);
