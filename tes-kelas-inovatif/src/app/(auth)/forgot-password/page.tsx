"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validasi input email
      if (!email) {
        setError("Email harus diisi");
        toast.error("Email harus diisi");
        return;
      }

      // 2. Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Format email tidak valid");
        toast.error("Format email tidak valid");
        return;
      }

      // 3. Tampilkan pesan sukses
      toast.success("Permintaan telah diproses.");

      // 4. Reset form
      setEmail("");

      // 5. Redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push("/auth/signin");
      }, 5000);
    } catch (error) {
      console.error("Error saat proses:", error);
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
          {/* Form lupa password */}
          <div
            className="flex flex-wrap content-center justify-center rounded-md bg-white"
            style={{ width: "24rem", height: "28rem" }}
          >
            <div className="w-72">
              {/* Header */}
              <h1 className="text-xl font-semibold text-center mb-1">
                Lupa Kata Sandi?
              </h1>
              <small className="text-gray-400 block text-center mb-5">
                Masukkan email Anda untuk melanjutkan
              </small>

              {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {error}
                </div>
              )}

              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-1.5 px-2 text-gray-600"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mb-1.5 block w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-2 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Mengirim..." : "Kirim"}
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/auth/signin"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Kembali ke halaman login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
