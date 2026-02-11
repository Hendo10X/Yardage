import { z } from "zod";
import { and, eq, desc, count, inArray } from "drizzle-orm";
import { router, protectedProcedure, sellerProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { order, orderItem, product } from "../../db/schema";
import { ProductStatus, OrderStatus } from "../enums";
import { notFound, badRequest, forbidden } from "../../lib/errors";

export const orderRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        items: z
          .array(
            z.object({
              productId: z.string(),
              quantity: z.number().int().min(1).default(1),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const productIds = input.items.map((i) => i.productId);
      const products = await db
        .select()
        .from(product)
        .where(
          and(
            inArray(product.id, productIds),
            eq(product.status, ProductStatus.ACTIVE),
          ),
        );

      const productMap = new Map(products.map((p) => [p.id, p]));

      const validItems = input.items.map((item) => {
        const p = productMap.get(item.productId);
        if (!p) badRequest(`Product ${item.productId} not found or unavailable`);
        if (p.storeId === ctx.user.id)
          badRequest("You cannot buy your own products");
        return { ...item, product: p };
      });

      const totalAmount = validItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      const [newOrder] = await db
        .insert(order)
        .values({
          buyerId: ctx.user.id,
          totalAmount,
          status: OrderStatus.PENDING,
        })
        .returning();

      const orderItems = validItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.product.id,
        storeId: item.product.storeId,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await db.insert(orderItem).values(orderItems);

      return db.query.order.findFirst({
        where: eq(order.id, newOrder.id),
        with: { items: true },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await db.query.order.findFirst({
        where: eq(order.id, input.id),
        with: {
          items: {
            with: { product: true, store: true },
          },
          buyer: true,
        },
      });

      if (!found) notFound("Order");

      const isBuyer = found.buyerId === ctx.user.id;
      const isSeller = found.items.some(
        (item) => item.store.userId === ctx.user.id,
      );

      if (!isBuyer && !isSeller) forbidden();

      return found;
    }),

  listMyOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
        status: z.nativeEnum(OrderStatus).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(order.buyerId, ctx.user.id)];
      if (input.status) conditions.push(eq(order.status, input.status));

      const where = and(...conditions);

      const [items, [{ total }]] = await Promise.all([
        db.query.order.findMany({
          where,
          with: { items: { with: { product: true } } },
          orderBy: desc(order.createdAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db.select({ total: count() }).from(order).where(where),
      ]);

      return {
        items,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  listStoreOrders: sellerProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
        status: z.nativeEnum(OrderStatus).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const storeOrderItems = await db
        .select({ orderId: orderItem.orderId })
        .from(orderItem)
        .where(eq(orderItem.storeId, ctx.store.id))
        .groupBy(orderItem.orderId);

      const orderIds = storeOrderItems.map((i) => i.orderId);

      if (orderIds.length === 0) {
        return { items: [], total: 0, page: input.page, totalPages: 0 };
      }

      const where = and(
        inArray(order.id, orderIds),
        ...(input.status ? [eq(order.status, input.status)] : []),
      );

      const [orders, [{ total }]] = await Promise.all([
        db.query.order.findMany({
          where,
          with: {
            items: {
              with: { product: true },
              where: eq(orderItem.storeId, ctx.store.id),
            },
            buyer: true,
          },
          orderBy: desc(order.createdAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db.select({ total: count() }).from(order).where(where),
      ]);

      return {
        items: orders,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  updateStatus: sellerProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum([OrderStatus.COMPLETED, OrderStatus.CANCELLED]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const found = await db.query.order.findFirst({
        where: eq(order.id, input.orderId),
        with: { items: true },
      });

      if (!found) notFound("Order");

      const hasStoreItems = found.items.some(
        (item) => item.storeId === ctx.store.id,
      );
      if (!hasStoreItems) forbidden();

      const validTransitions: Record<string, string[]> = {
        [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      };

      const allowed = validTransitions[found.status];
      if (!allowed?.includes(input.status))
        badRequest(
          `Cannot transition from ${found.status} to ${input.status}`,
        );

      if (input.status === OrderStatus.COMPLETED) {
        const productIds = found.items.map((item) => item.productId);
        await db
          .update(product)
          .set({ status: ProductStatus.SOLD })
          .where(inArray(product.id, productIds));
      }

      const [updated] = await db
        .update(order)
        .set({ status: input.status })
        .where(eq(order.id, input.orderId))
        .returning();

      return updated;
    }),
});
