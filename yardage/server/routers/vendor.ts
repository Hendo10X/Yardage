import { and, eq, count, sql, inArray } from "drizzle-orm";
import { router, protectedProcedure, sellerProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { store, product, order, orderItem } from "../../db/schema";
import { ProductStatus, OrderStatus } from "../enums";

export const vendorRouter = router({
  checkStatus: protectedProcedure.query(async ({ ctx }) => {
    const [userStore] = await db
      .select()
      .from(store)
      .where(eq(store.userId, ctx.user.id))
      .limit(1);

    return {
      isVendor: !!userStore,
      store: userStore ?? null,
    };
  }),

  stats: sellerProcedure.query(async ({ ctx }) => {
    const [
      [{ active }],
      [{ sold }],
      [{ earned }],
      pendingProducts,
    ] = await Promise.all([
      db
        .select({ active: count() })
        .from(product)
        .where(
          and(
            eq(product.storeId, ctx.store.id),
            eq(product.status, ProductStatus.ACTIVE),
          ),
        ),
      db
        .select({ sold: count() })
        .from(product)
        .where(
          and(
            eq(product.storeId, ctx.store.id),
            eq(product.status, ProductStatus.SOLD),
          ),
        ),
      db
        .select({
          earned:
            sql<number>`coalesce(sum(${orderItem.price} * ${orderItem.quantity}), 0)`,
        })
        .from(orderItem)
        .innerJoin(order, eq(orderItem.orderId, order.id))
        .where(
          and(
            eq(orderItem.storeId, ctx.store.id),
            eq(order.status, OrderStatus.COMPLETED),
          ),
        ),
      db
        .selectDistinct({ productId: orderItem.productId })
        .from(orderItem)
        .innerJoin(order, eq(orderItem.orderId, order.id))
        .where(
          and(
            eq(orderItem.storeId, ctx.store.id),
            inArray(order.status, [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
            ]),
          ),
        ),
    ]);

    return {
      active,
      pending: pendingProducts.length,
      sold,
      earned: Number(earned),
    };
  }),
});
