import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db/drizzle";
import { category } from "../../db/schema";
import { notFound, conflict } from "../../lib/errors";
import { generateSlug } from "../../lib/utils";

export const categoryRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select({ id: category.id })
        .from(category)
        .where(eq(category.name, input.name))
        .limit(1);

      if (existing) conflict("Category with this name already exists");

      const [created] = await db
        .insert(category)
        .values({
          name: input.name,
          slug: generateSlug(input.name),
          description: input.description,
        })
        .returning();

      return created;
    }),

  list: publicProcedure.query(async () => {
    return db.select().from(category).orderBy(category.name);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [found] = await db
        .select()
        .from(category)
        .where(eq(category.id, input.id))
        .limit(1);

      if (!found) notFound("Category");
      return found;
    }),
});
