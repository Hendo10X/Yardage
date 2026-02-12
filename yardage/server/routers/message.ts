import { z } from "zod";
import { and, eq, or, desc, count } from "drizzle-orm";
import { router, protectedProcedure, sellerProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { conversation, message, product } from "../../db/schema";
import { notFound, forbidden, badRequest } from "../../lib/errors";
import { scanMessage } from "../../lib/message-guard";

export const messageRouter = router({
  startConversation: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const found = await db.query.product.findFirst({
        where: eq(product.id, input.productId),
        with: { store: true },
      });

      if (!found) notFound("Product");
      if (found.store.userId === ctx.user.id)
        badRequest("You cannot message yourself about your own product");

      const [existing] = await db
        .select()
        .from(conversation)
        .where(
          and(
            eq(conversation.buyerId, ctx.user.id),
            eq(conversation.productId, input.productId),
          ),
        )
        .limit(1);

      const guard = scanMessage(input.content);

      if (existing) {
        const [msg] = await db
          .insert(message)
          .values({
            conversationId: existing.id,
            senderId: ctx.user.id,
            content: input.content,
          })
          .returning();

        await db
          .update(conversation)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversation.id, existing.id));

        return { conversation: existing, message: msg, ...guard };
      }

      const [newConversation] = await db
        .insert(conversation)
        .values({
          buyerId: ctx.user.id,
          sellerId: found.store.userId,
          productId: input.productId,
          storeId: found.storeId,
        })
        .returning();

      const [msg] = await db
        .insert(message)
        .values({
          conversationId: newConversation.id,
          senderId: ctx.user.id,
          content: input.content,
        })
        .returning();

      return { conversation: newConversation, message: msg, ...guard };
    }),

  send: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [conv] = await db
        .select()
        .from(conversation)
        .where(eq(conversation.id, input.conversationId))
        .limit(1);

      if (!conv) notFound("Conversation");
      if (conv.buyerId !== ctx.user.id && conv.sellerId !== ctx.user.id)
        forbidden("You are not a participant in this conversation");

      const guard = scanMessage(input.content);

      const [msg] = await db
        .insert(message)
        .values({
          conversationId: conv.id,
          senderId: ctx.user.id,
          content: input.content,
        })
        .returning();

      await db
        .update(conversation)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversation.id, conv.id));

      return { message: msg, ...guard };
    }),

  getConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conv = await db.query.conversation.findFirst({
        where: eq(conversation.id, input.conversationId),
        with: { product: true, buyer: true, seller: true },
      });

      if (!conv) notFound("Conversation");
      if (conv.buyerId !== ctx.user.id && conv.sellerId !== ctx.user.id)
        forbidden("You are not a participant in this conversation");

      const [messages, [{ total }]] = await Promise.all([
        db
          .select()
          .from(message)
          .where(eq(message.conversationId, input.conversationId))
          .orderBy(desc(message.createdAt))
          .limit(input.limit)
          .offset((input.page - 1) * input.limit),
        db
          .select({ total: count() })
          .from(message)
          .where(eq(message.conversationId, input.conversationId)),
      ]);

      const otherUserId =
        conv.buyerId === ctx.user.id ? conv.sellerId : conv.buyerId;

      await db
        .update(message)
        .set({ isRead: true })
        .where(
          and(
            eq(message.conversationId, input.conversationId),
            eq(message.isRead, false),
            eq(message.senderId, otherUserId),
          ),
        );

      return {
        conversation: conv,
        messages,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  listMine: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
        role: z.enum(["buyer", "seller"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let where;

      if (input.role === "buyer") {
        where = eq(conversation.buyerId, ctx.user.id);
      } else if (input.role === "seller") {
        where = eq(conversation.sellerId, ctx.user.id);
      } else {
        where = or(
          eq(conversation.buyerId, ctx.user.id),
          eq(conversation.sellerId, ctx.user.id),
        );
      }

      const [conversations, [{ total }]] = await Promise.all([
        db.query.conversation.findMany({
          where,
          with: {
            product: true,
            buyer: true,
            seller: true,
            messages: {
              limit: 1,
              orderBy: desc(message.createdAt),
            },
          },
          orderBy: desc(conversation.lastMessageAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db.select({ total: count() }).from(conversation).where(where),
      ]);

      return {
        items: conversations,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  listByProduct: sellerProcedure
    .input(
      z.object({
        productId: z.string(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [found] = await db
        .select()
        .from(product)
        .where(eq(product.id, input.productId))
        .limit(1);

      if (!found) notFound("Product");
      if (found.storeId !== ctx.store.id)
        forbidden("This product does not belong to your store");

      const where = and(
        eq(conversation.productId, input.productId),
        eq(conversation.storeId, ctx.store.id),
      );

      const [conversations, [{ total }]] = await Promise.all([
        db.query.conversation.findMany({
          where,
          with: {
            buyer: true,
            product: true,
            messages: {
              limit: 1,
              orderBy: desc(message.createdAt),
            },
          },
          orderBy: desc(conversation.lastMessageAt),
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
        }),
        db.select({ total: count() }).from(conversation).where(where),
      ]);

      return {
        items: conversations,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [conv] = await db
        .select()
        .from(conversation)
        .where(eq(conversation.id, input.conversationId))
        .limit(1);

      if (!conv) notFound("Conversation");
      if (conv.buyerId !== ctx.user.id && conv.sellerId !== ctx.user.id)
        forbidden("You are not a participant in this conversation");

      const otherUserId =
        conv.buyerId === ctx.user.id ? conv.sellerId : conv.buyerId;

      await db
        .update(message)
        .set({ isRead: true })
        .where(
          and(
            eq(message.conversationId, input.conversationId),
            eq(message.senderId, otherUserId),
            eq(message.isRead, false),
          ),
        );

      return { success: true };
    }),
});
