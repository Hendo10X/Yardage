import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { order } from "../../db/schema";
import { OrderStatus, PaymentStatus } from "../enums";
import { notFound, badRequest, forbidden } from "../../lib/errors";
import {
  initializeTransaction,
  verifyTransaction,
} from "../../lib/paystack";

export const paymentRouter = router({
  initialize: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        callbackUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [found] = await db
        .select()
        .from(order)
        .where(eq(order.id, input.orderId))
        .limit(1);

      if (!found) notFound("Order");
      if (found.buyerId !== ctx.user.id)
        forbidden("This order does not belong to you");
      if (found.status !== OrderStatus.PENDING)
        badRequest("Only pending orders can be paid");
      if (found.paymentStatus === PaymentStatus.PAID)
        badRequest("This order has already been paid");

      const reference = `yrd_${found.id}_${Date.now()}`;

      const result = await initializeTransaction({
        email: ctx.user.email,
        amount: found.totalAmount,
        reference,
        callbackUrl: input.callbackUrl,
        metadata: {
          orderId: found.id,
          userId: ctx.user.id,
        },
      });

      await db
        .update(order)
        .set({ paymentReference: reference })
        .where(eq(order.id, found.id));

      return {
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
        reference: result.data.reference,
      };
    }),

  verify: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [found] = await db
        .select()
        .from(order)
        .where(eq(order.id, input.orderId))
        .limit(1);

      if (!found) notFound("Order");
      if (found.buyerId !== ctx.user.id)
        forbidden("This order does not belong to you");

      if (found.paymentStatus === PaymentStatus.PAID) {
        return {
          status: PaymentStatus.PAID,
          orderStatus: found.status,
          paidAt: found.paidAt,
        };
      }

      if (!found.paymentReference)
        badRequest("No payment has been initialized for this order");

      const result = await verifyTransaction(found.paymentReference);
      const txStatus = result.data.status;
      const txAmount = result.data.amount;

      if (txStatus === "success" && txAmount === found.totalAmount) {
        const [updated] = await db
          .update(order)
          .set({
            paymentStatus: PaymentStatus.PAID,
            status: OrderStatus.CONFIRMED,
            paidAt: new Date(result.data.paid_at),
          })
          .where(eq(order.id, found.id))
          .returning();

        return {
          status: PaymentStatus.PAID,
          orderStatus: updated.status,
          paidAt: updated.paidAt,
        };
      }

      if (txStatus === "failed" || txStatus === "abandoned") {
        await db
          .update(order)
          .set({ paymentStatus: PaymentStatus.FAILED })
          .where(eq(order.id, found.id));

        return {
          status: PaymentStatus.FAILED,
          orderStatus: found.status,
          paidAt: null,
        };
      }

      return {
        status: PaymentStatus.PENDING,
        orderStatus: found.status,
        paidAt: null,
      };
    }),
});
