import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { wishlist, product, store } from "../../db/schema";
import { notFound } from "../../lib/errors";

export const wishlistRouter = router({
  toggle: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.wishlist.findFirst({
        where: and(
          eq(wishlist.userId, ctx.user.id),
          eq(wishlist.productId, input.productId)
        ),
      });

      if (existing) {
        await db.delete(wishlist).where(eq(wishlist.id, existing.id));
        return { added: false };
      }

      await db.insert(wishlist).values({
        userId: ctx.user.id,
        productId: input.productId,
      });

      return { added: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const items = await db
      .select({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        condition: product.condition,
        store: {
          id: store.id,
          name: store.name,
        },
      })
      .from(wishlist)
      .innerJoin(product, eq(wishlist.productId, product.id))
      .leftJoin(store, eq(product.storeId, store.id))
      .where(eq(wishlist.userId, ctx.user.id));

    return items;
  }),

  check: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existing = await db.query.wishlist.findFirst({
        where: and(
          eq(wishlist.userId, ctx.user.id),
          eq(wishlist.productId, input.productId)
        ),
      });

      return !!existing;
    }),
});
