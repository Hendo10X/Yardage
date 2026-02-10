import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api"; // Correct imports
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const extractDomain = (email: string) => email.split("@")[1]?.toLowerCase();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
      },
      universityId: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  hooks: {
  before: createAuthMiddleware(async (ctx) => {
    const { path, body } = ctx;
    const isSignUp = path.includes("/sign-up/email") || path.includes("/signup/email");

    if (isSignUp && body && typeof body === "object" && "email" in body) {
      const email = body.email as string;
      const domain = email.split("@")[1]?.toLowerCase();

      const university = await db.query.universityWhitelist.findFirst({
        where: eq(schema.universityWhitelist.domain, domain),
      });

      if (!university) {
        throw new APIError("FORBIDDEN", { 
          message: `The domain "${domain}" is not whitelisted.`,
        });
      }

      ctx.body = {
        ...body,
        universityId: university.id,
        role: "USER",
      };

      return { context: ctx };
    }
  }),
},
  plugins: [nextCookies()],
});