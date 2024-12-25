import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard/:path*"];
  const authRoutes = ["/signin", "/signup", "/forgot-password"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route.replace(':path*', ''))
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!dashboard).*)"],
};
