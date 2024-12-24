"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface DashboardNavProps {
  user: User;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // 1. Konfirmasi logout
      if (!window.confirm("Apakah Anda yakin ingin keluar?")) {
        setIsLoggingOut(false);
        return;
      }

      // 2. Proses logout dari Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error saat logout:", error);
        toast.error("Gagal keluar dari sistem. Silakan coba lagi.");
        return;
      }

      // 3. Hapus token dari localStorage
      localStorage.removeItem("supabase.auth.token");

      // 4. Hapus data sesi lainnya jika ada
      sessionStorage.clear();

      // 5. Tampilkan pesan sukses
      toast.success("Berhasil keluar dari sistem");

      // 6. Redirect ke halaman login
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1000);
    } catch (error) {
      console.error("Error saat proses logout:", error);
      toast.error("Terjadi kesalahan saat keluar dari sistem");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-blue-600"
              >
                Dashboard
              </Link>
            </div>

            {/* Menu Navigasi */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Beranda
              </Link>
              <Link
                href="/dashboard/posts-list"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Artikel Saya
              </Link>
              <Link
                href="/dashboard/create-post"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tulis Artikel
              </Link>
              <Link
                href="/dashboard/profile"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profil
              </Link>
            </div>
          </div>

          {/* Tombol Logout */}
          <div className="flex items-center">
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoggingOut ? "Sedang Keluar..." : "Keluar"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
