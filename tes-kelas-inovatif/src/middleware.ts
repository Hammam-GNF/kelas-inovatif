import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Mengawait cookies untuk mendapatkan nilai cookie
  const cookiesStore = await cookies();
  const token = cookiesStore.get("sb-auth-token")?.value;

  // Mendapatkan sesi pengguna
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("Session:", session);

  const path = request.nextUrl.pathname;

  // Rute yang dilindungi dan rute autentikasi
  const protectedRoutes = ["/chat", "/dashboard/:path*"];
  const authRoutes = ["/login", "/register"];

  // Memeriksa apakah rute yang diakses adalah rute yang dilindungi
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route.replace(":path*", ""))
  );
  // Memeriksa apakah rute yang diakses adalah rute autentikasi
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Jika rute dilindungi dan tidak ada sesi, arahkan ke halaman login
  if (isProtectedRoute && !session) {
    console.log("Redirecting to login due to no session");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika rute autentikasi dan ada sesi, arahkan ke halaman dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Mengelola cookie autentikasi
  const authCookie = request.cookies.get("sb-auth-token");
  if (session && !authCookie) {
    response.cookies.set("sb-auth-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
    });
  } else if (!session && authCookie) {
    response.cookies.delete("sb-auth-token");
  }

  console.log("Cookies:", await cookies());

  return response;
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/chat/:path*", "/dashboard/:path*", "/login", "/register"],
};
