"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Toaster } from "react-hot-toast";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/dashboard");
    };
    checkAuth();
  }, [router]);

  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}
