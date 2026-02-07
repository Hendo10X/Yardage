import { z } from "zod";
import { and, eq, desc, avg, count } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { review, product, order, orderItem } from "../../db/schema";
import { OrderStatus } from "../enums";
import { notFound, badRequest, forbidden, conflict } from "../../lib/errors";

export const reviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await db.query.product.findFirst({
        where: eq(product.id, input.productId),
      });

      if (!foundProduct) notFound("Product");

      const [purchased] = await db
        .select({ id: orderItem.id })
        .from(orderItem)
        .innerJoin(order, eq(orderItem.orderId, order.id))
        .where(
          and(
            eq(orderItem.productId, input.productId),
            eq(order.buyerId, ctx.user.id),
            eq(order.status, OrderStatus.COMPLETED),
          ),
        )
        .limit(1);

      if (!purchased) badRequest("You can only review products you've purchased");

      const [existing] = await db
        .select({ id: review.id })
        .from(review)
        .where(
          and(
            eq(review.userId, ctx.user.id),
            eq(review.productId, input.productId),
          ),
        )
        .limit(1);

      if (existing) conflict("You have already reviewed this product");

      const [created] = await db
        .insert(review)
        .values({
          rating: input.rating,
          comment: input.comment,
          userId: ctx.user.id,
          productId: input.productId,
          storeId: foundProduct.storeId,
        })
        .returning();

      return created;
    }),

  getByProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      const where = eq(review.productId, input.productId);

      const [items, [totals]] = await Promise.all([
        db.query.review.findMany({
          where,
          with: { user: true },
          orderBy: desc(review.createdAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db
          .select({
            total: count(),
            averageRating: avg(review.rating),
          })
          .from(review)
          .where(where),
      ]);

      return {
        items,
        total: totals.total,
        averageRating: totals.averageRating
          ? parseFloat(totals.averageRating)
          : 0,
        page: input.page,
        totalPages: Math.ceil(totals.total / input.limit),
      };
    }),

  getByStore: publicProcedure
    .input(
      z.object({
        storeId: z.string(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      const where = eq(review.storeId, input.storeId);

      const [items, [totals]] = await Promise.all([
        db.query.review.findMany({
          where,
          with: { user: true, product: true },
          orderBy: desc(review.createdAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db
          .select({
            total: count(),
            averageRating: avg(review.rating),
          })
          .from(review)
          .where(where),
      ]);

      return {
        items,
        total: totals.total,
        averageRating: totals.averageRating
          ? parseFloat(totals.averageRating)
          : 0,
        page: input.page,
        totalPages: Math.ceil(totals.total / input.limit),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rating: z.number().int().min(1).max(5).optional(),
        comment: z.string().max(1000).nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(review)
        .where(eq(review.id, input.id))
        .limit(1);

      if (!existing) notFound("Review");
      if (existing.userId !== ctx.user.id) forbidden();

      const { id: _id, ...updateData } = input;

      const [updated] = await db
        .update(review)
        .set(updateData)
        .where(eq(review.id, input.id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(review)
        .where(eq(review.id, input.id))
        .limit(1);

      if (!existing) notFound("Review");
      if (existing.userId !== ctx.user.id) forbidden();

      await db.delete(review).where(eq(review.id, input.id));

      return { success: true };
    }),
});
