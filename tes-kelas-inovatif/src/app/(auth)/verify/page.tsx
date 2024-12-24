"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams?.get("token");

        if (!token) {
          toast.error("Token verifikasi tidak valid");
          router.push("/signin");
          return;
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) {
          throw error;
        }

        toast.success("Email berhasil diverifikasi");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (error) {
        console.error("Error verifying email:", error);
        toast.error("Gagal memverifikasi email");
        router.push("/signin");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          {isVerifying ? "Memverifikasi Email..." : "Verifikasi Email"}
        </h1>
        <p className="text-center text-gray-600">
          {isVerifying
            ? "Mohon tunggu sebentar..."
            : "Email Anda telah berhasil diverifikasi"}
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
