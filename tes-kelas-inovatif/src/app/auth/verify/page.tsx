"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (type === "email_confirmation") {
          // Verify the email
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token!,
            type: "email",
          });

          if (error) throw error;

          // Show success message
          toast.success("Email verified successfully! You can now sign in.");

          // Redirect to sign in page
          setTimeout(() => {
            router.push(
              "/auth/signin?message=Email verified successfully! Please sign in."
            );
          }, 2000);
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setError(error.message);
        toast.error("Failed to verify email");
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}
      </div>
    </div>
  );
}
