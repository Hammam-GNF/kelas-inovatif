"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cek status autentikasi saat komponen dimuat
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validasi input dasar
      if (!email || !password) {
        setError("Email dan kata sandi harus diisi");
        toast.error("Email dan kata sandi harus diisi");
        setLoading(false);
        return;
      }

      // 2. Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Format email tidak valid");
        toast.error("Format email tidak valid");
        setLoading(false);
        return;
      }

      // 3. Validasi panjang password
      if (password.length < 8) {
        setError("Kata sandi minimal 8 karakter");
        toast.error("Kata sandi minimal 8 karakter");
        setLoading(false);
        return;
      }

      // Coba login dengan Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email atau kata sandi tidak valid");
          toast.error("Email atau kata sandi tidak valid");
        } else {
          setError("Terjadi kesalahan saat login. Silakan coba lagi.");
          toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
        }
        return;
      }

      if (!data?.user) {
        setError("Akun tidak ditemukan");
        toast.error("Akun tidak ditemukan");
        return;
      }

      // Cek profil pengguna
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        // Jika profil belum ada, buat profil baru
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata.full_name || "",
              role: "user",
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (createProfileError) {
          console.error("Error saat membuat profil:", createProfileError);
          setError("Gagal membuat profil pengguna");
          return;
        }
      }

      // Berhasil! Tampilkan pesan dan arahkan ke dashboard
      toast.success("Login berhasil!");

      // Gunakan replace alih-alih push untuk menghindari masalah dengan history
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Error login:", error);
      setError("Terjadi kesalahan yang tidak diketahui");
      toast.error("Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  // Render form login
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-100 py-10">
        <div className="flex shadow-md">
          {/* Form login */}
          <div
            className="flex flex-wrap content-center justify-center rounded-l-md bg-white"
            style={{ width: "24rem", height: "32rem" }}
          >
            <div className="w-72">
              {/* Header */}
              <h1 className="text-xl font-semibold">Selamat Datang Kembali</h1>
              <small className="text-gray-400">
                Silakan masukkan detail akun Anda
              </small>

              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {error}
                </div>
              )}

              {/* Form */}
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
                    {loading ? "Sedang Masuk..." : "Masuk"}
                  </Button>
                </div>

                <div className="text-center mb-3">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center">
                <span className="text-xs text-gray-400 font-semibold">
                  Belum punya akun?{" "}
                </span>
                <Link
                  href="/auth/signup"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </div>

          {/* Banner login */}
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
