"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { signInAction } from "./server-action";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInAction({ email, password });

      if (!result) throw new Error("Gagal melakukan sign in");

      if ("serverError" in result && typeof result.serverError === "string") {
        setError(result.serverError);
        toast.error(result.serverError);
        return;
      }

      toast.success("Login berhasil!");
      router.replace("/dashboard");
    } catch {
      setError("Terjadi kesalahan yang tidak diketahui");
      toast.error("Terjadi kesalahan yang tidak diketahui");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-100 py-10">
        <div className="flex shadow-md">
          <div
            className="flex flex-wrap content-center justify-center rounded-l-md bg-white"
            style={{ width: "24rem", height: "32rem" }}
          >
            <div className="w-72">
              <h1 className="text-xl font-semibold">Selamat Datang Kembali</h1>
              <small className="text-gray-400">
                Silakan masukkan detail akun Anda
              </small>

              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
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
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-1.5 px-2 text-gray-600"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>

                <div className="mb-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mb-1.5 block w-full text-center text-white bg-blue-600 hover:bg-blue-700 px-2 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sedang Masuk..." : "Masuk"}
                  </Button>
                </div>

                <div className="text-center mb-3">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </form>

              <div className="text-center">
                <span className="text-xs text-gray-400 font-semibold">
                  Belum punya akun?{" "}
                </span>
                <Link
                  href="/signup"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </div>

          <div
            className="hidden md:flex flex-wrap content-center justify-center rounded-r-md"
            style={{ width: "24rem", height: "32rem" }}
          >
            <img
              className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md"
              src="https://i.imgur.com/9l1A4OS.jpeg"
              alt="Banner login"
            />
          </div>
        </div>
      </div>
    </>
  );
}
