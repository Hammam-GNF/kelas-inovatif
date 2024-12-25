"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Berhasil logout!");
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Gagal logout");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-800"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 mr-4">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
