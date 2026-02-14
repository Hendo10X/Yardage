import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { store, user } from "../../db/schema";
import { notFound, conflict } from "../../lib/errors";
import { generateSlug } from "../../lib/utils";

export const storeRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        description: z.string().max(500).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select({ id: store.id })
        .from(store)
        .where(eq(store.userId, ctx.user.id))
        .limit(1);

      if (existing) conflict("You already have a store");

      const [created] = await db
        .insert(store)
        .values({
          name: input.name,
          description: input.description,
          image: input.image,
          slug: generateSlug(input.name),
          userId: ctx.user.id,
        })
        .returning();

      // Update user role to SELLER
      await db
        .update(user)
        .set({ role: "SELLER" })
        .where(eq(user.id, ctx.user.id));

      return created;
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    const [found] = await db
      .select()
      .from(store)
      .where(eq(store.userId, ctx.user.id))
      .limit(1);

    if (!found) notFound("Store");
    return found;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [found] = await db
        .select()
        .from(store)
        .where(eq(store.id, input.id))
        .limit(1);

      if (!found) notFound("Store");
      return found;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [found] = await db
        .select()
        .from(store)
        .where(eq(store.slug, input.slug))
        .limit(1);

      if (!found) notFound("Store");
      return found;
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100).optional(),
        description: z.string().max(500).nullable().optional(),
        image: z.string().url().nullable().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(store)
        .where(eq(store.userId, ctx.user.id))
        .limit(1);

      if (!existing) notFound("Store");

      const [updated] = await db
        .update(store)
        .set({
          ...(input.name !== undefined && {
            name: input.name,
            slug: generateSlug(input.name),
          }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        })
        .where(eq(store.id, existing.id))
        .returning();

      return updated;
    }),
});
