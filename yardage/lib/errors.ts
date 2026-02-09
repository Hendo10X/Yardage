import { TRPCError } from "@trpc/server";

export function notFound(resource: string): never {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `${resource} not found`,
  });
}

export function forbidden(message = "You don't have permission to perform this action"): never {
  throw new TRPCError({
    code: "FORBIDDEN",
    message,
  });
}

export function badRequest(message: string): never {
  throw new TRPCError({
    code: "BAD_REQUEST",
    message,
  });
}

export function conflict(message: string): never {
  throw new TRPCError({
    code: "CONFLICT",
    message,
  });
}

export function unauthorized(message = "You must be logged in"): never {
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message,
  });
}
