import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers";

/**
 * Typed tRPC React hooks.
 * Use these hooks in your components for fully type-safe API calls:
 *
 * @example
 * ```tsx
 * const { data } = trpc.user.getSession.useQuery();
 * const mutation = trpc.user.healthCheck.useQuery();
 * ```
 */
export const trpc = createTRPCReact<AppRouter>();
