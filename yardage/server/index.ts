import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { trpc } from "@elysiajs/trpc";
import { appRouter } from "./routers";
import { createContext } from "./trpc";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(
    trpc(appRouter, {
      endpoint: "/trpc",
      createContext,
    }),
  )
  .listen(3001);

console.log(
  `Elysia server running at http://localhost:${app.server?.port}/trpc`,
);

export type { AppRouter } from "./routers";
