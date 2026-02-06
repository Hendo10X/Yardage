import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createContext } from "@/server/trpc";

/**
 * tRPC HTTP handler for Next.js App Router.
 * This allows tRPC to run through Next.js API routes on the same domain,
 * avoiding CORS issues and sharing cookies/auth seamlessly.
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createContext(opts),
  });

export { handler as GET, handler as POST };
