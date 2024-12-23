"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validasi token reset password
  useEffect(() => {
    const token = searchParams?.get("token");
    if (!token) {
      toast.error("Token reset password tidak valid");
      router.push("/auth/forgot-password");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validasi input
      if (!newPassword || !confirmPassword) {
        setError("Semua field harus diisi");
        toast.error("Semua field harus diisi");
        return;
      }

      // 2. Validasi panjang password
      if (newPassword.length < 8) {
        setError("Kata sandi minimal 8 karakter");
        toast.error("Kata sandi minimal 8 karakter");
        return;
      }

      // 3. Validasi kecocokan password
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi kata sandi tidak cocok");
        toast.error("Konfirmasi kata sandi tidak cocok");
        return;
      }

      // 4. Proses update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error saat update password:", updateError);
        setError("Gagal memperbarui kata sandi");
        toast.error("Gagal memperbarui kata sandi");
        return;
      }

      // 5. Tampilkan pesan sukses
      toast.success("Kata sandi berhasil diperbarui");

      // 6. Reset form
      setNewPassword("");
      setConfirmPassword("");

      // 7. Redirect ke halaman login
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      console.error("Error saat proses reset password:", error);
      setError("Terjadi kesalahan yang tidak diketahui");
      toast.error("Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-100 py-10">
        <div className="flex shadow-md">
          {/* Form reset password */}
          <div
            className="flex flex-wrap content-center justify-center rounded-md bg-white"
            style={{ width: "24rem", height: "32rem" }}
          >
            <div className="w-72">
              {/* Header */}
              <h1 className="text-xl font-semibold text-center mb-1">
                Reset Kata Sandi
              </h1>
              <small className="text-gray-400 block text-center mb-5">
                Masukkan kata sandi baru Anda
              </small>

              {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {error}
                </div>
              )}

              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan kata sandi baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-1.5 px-2 text-gray-600"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                  <small className="text-gray-400 text-xs mt-1">
                    Minimal 8 karakter
                  </small>
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    type="password"
                    placeholder="Konfirmasi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-1.5 px-2 text-gray-600"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </div>

                <div className="mb-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mb-1.5 block w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-2 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Memperbarui..." : "Perbarui Kata Sandi"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
