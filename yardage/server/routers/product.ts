import { z } from "zod";
import { and, eq, gte, lte, ilike, desc, asc, count } from "drizzle-orm";
import {
  router,
  publicProcedure,
  protectedProcedure,
  sellerProcedure,
} from "../trpc";
import { db } from "../../db/drizzle";
import { product, store } from "../../db/schema";
import { ProductCondition, ProductStatus, SortBy } from "../enums";
import { notFound, forbidden, badRequest } from "../../lib/errors";

export const productRouter = router({
  create: sellerProcedure
    .input(
      z.object({
        name: z.string().min(2).max(200),
        description: z.string().max(2000).optional(),
        price: z.number().int().positive(),
        images: z.array(z.string().url()).max(10).optional(),
        condition: z.nativeEnum(ProductCondition),
        categoryId: z.string().optional(),
        status: z
          .enum([ProductStatus.ACTIVE, ProductStatus.DRAFT])
          .default(ProductStatus.DRAFT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await db
        .insert(product)
        .values({
          name: input.name,
          description: input.description,
          price: input.price,
          images: input.images ?? [],
          condition: input.condition,
          status: input.status,
          categoryId: input.categoryId,
          storeId: ctx.store.id,
        })
        .returning();

      return created;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const found = await db.query.product.findFirst({
        where: eq(product.id, input.id),
        with: { store: true, category: true },
      });

      if (!found) notFound("Product");
      return found;
    }),

  update: sellerProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(200).optional(),
        description: z.string().max(2000).nullable().optional(),
        price: z.number().int().positive().optional(),
        images: z.array(z.string().url()).max(10).optional(),
        condition: z.nativeEnum(ProductCondition).optional(),
        categoryId: z.string().nullable().optional(),
        status: z
          .enum([ProductStatus.ACTIVE, ProductStatus.DRAFT])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(product)
        .where(eq(product.id, input.id))
        .limit(1);

      if (!existing) notFound("Product");
      if (existing.storeId !== ctx.store.id) forbidden();
      if (existing.status === ProductStatus.SOLD)
        badRequest("Cannot update a sold product");

      const { id: _id, ...updateData } = input;

      const [updated] = await db
        .update(product)
        .set(updateData)
        .where(eq(product.id, input.id))
        .returning();

      return updated;
    }),

  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
        categoryId: z.string().optional(),
        storeId: z.string().optional(),
        condition: z.nativeEnum(ProductCondition).optional(),
        minPrice: z.number().int().optional(),
        maxPrice: z.number().int().optional(),
        search: z.string().optional(),
        sort: z.nativeEnum(SortBy).default(SortBy.NEWEST),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [eq(product.status, ProductStatus.ACTIVE)];

      if (input.categoryId)
        conditions.push(eq(product.categoryId, input.categoryId));
      if (input.storeId) conditions.push(eq(product.storeId, input.storeId));
      if (input.condition)
        conditions.push(eq(product.condition, input.condition));
      if (input.minPrice) conditions.push(gte(product.price, input.minPrice));
      if (input.maxPrice) conditions.push(lte(product.price, input.maxPrice));
      if (input.search)
        conditions.push(ilike(product.name, `%${input.search}%`));

      const where = and(...conditions);

      const sortMap = {
        [SortBy.NEWEST]: desc(product.createdAt),
        [SortBy.OLDEST]: asc(product.createdAt),
        [SortBy.PRICE_ASC]: asc(product.price),
        [SortBy.PRICE_DESC]: desc(product.price),
      };

      const [items, [{ total }]] = await Promise.all([
        db
          .select()
          .from(product)
          .where(where)
          .orderBy(sortMap[input.sort])
          .limit(input.limit)
          .offset((input.page - 1) * input.limit),
        db.select({ total: count() }).from(product).where(where),
      ]);

      return {
        items,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  listMine: sellerProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
        status: z.nativeEnum(ProductStatus).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(product.storeId, ctx.store.id)];

      if (input.status) conditions.push(eq(product.status, input.status));

      const where = and(...conditions);

      const [items, [{ total }]] = await Promise.all([
        db
          .select()
          .from(product)
          .where(where)
          .orderBy(desc(product.createdAt))
          .limit(input.limit)
          .offset((input.page - 1) * input.limit),
        db.select({ total: count() }).from(product).where(where),
      ]);

      return {
        items,
        total,
        page: input.page,
        totalPages: Math.ceil(total / input.limit),
      };
    }),
});
