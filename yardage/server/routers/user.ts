import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../../db/drizzle";
import { user, universityWhitelist } from "../../db/schema";
import { eq } from "drizzle-orm";

export const userRouter = router({
  checkUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.name, input.username))
        .limit(1);

      return {
        available: !existingUser,
      };
    }),
  listUniversities: publicProcedure.query(async () => {
    return await db.select().from(universityWhitelist);
  }),
  checkUniversity: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const domain = input.email.split("@")[1]?.toLowerCase();
      if (!domain) return { registered: false };

      const university = await db.query.universityWhitelist.findFirst({
        where: eq(universityWhitelist.domain, domain),
      });

      return {
        registered: !!university,
        universityName: university?.name,
      };
    }),
});
