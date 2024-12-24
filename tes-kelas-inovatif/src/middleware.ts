import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // 1. Buat response awal
    const res = NextResponse.next();

    // 2. Buat Supabase client
    const supabase = createMiddlewareClient({ req: request, res });

    // 3. Cek session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 4. Dapatkan URL saat ini
    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 5. Daftar rute yang dilindungi
    const protectedRoutes = [
      "/dashboard",
      "/dashboard/profile",
      "/dashboard/reset-password",
      "/dashboard/posts-list",
      "/dashboard/create-post",
      "/dashboard/edit-post",
      "/dashboard/delete-post",
    ];

    // 6. Cek apakah rute saat ini adalah rute yang dilindungi
    const isProtectedRoute = protectedRoutes.some((route) =>
      path.startsWith(route)
    );

    // 7. Redirect logic
    if (isProtectedRoute) {
      if (!session) {
        // Redirect ke login jika mencoba akses rute yang dilindungi tanpa login
        const redirectUrl = new URL("/signin", requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
      }
      // Pengguna sudah login dan mengakses rute yang dilindungi
      return res;
    }

    // 8. Handle rute auth
    if (path.startsWith("/signin")) {
      if (session) {
        // Jika sudah login dan mencoba akses halaman auth, redirect ke dashboard
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
      }
      // Pengguna belum login dan mengakses halaman auth
      return res;
    }

    // 9. Default response untuk rute lainnya
    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    // Redirect ke halaman error jika terjadi masalah
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

// Konfigurasi matcher
export const config = {
  matcher: ["/dashboard/"],
};
