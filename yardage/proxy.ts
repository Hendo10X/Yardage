import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000;

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Use request.headers instead of headers() as per Better-Auth middleware best practices
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  if (session) {
    const lastActive = request.cookies.get("last-active")?.value;
    const now = Date.now();

    if (lastActive) {
      const lastActiveTime = parseInt(lastActive, 10);
      if (now - lastActiveTime > INACTIVITY_LIMIT) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("last-active");
        return response;
      }
    }
  }

  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  if (session) {
    response.cookies.set("last-active", Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
