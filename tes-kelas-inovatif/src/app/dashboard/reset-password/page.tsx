"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function DashboardResetPassword() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validasi input
      if (!oldPassword || !newPassword || !confirmPassword) {
        setError("Semua field harus diisi");
        toast.error("Semua field harus diisi");
        return;
      }

      // 2. Validasi panjang password baru
      if (newPassword.length < 8) {
        setError("Kata sandi baru minimal 8 karakter");
        toast.error("Kata sandi baru minimal 8 karakter");
        return;
      }

      // 3. Validasi kecocokan password baru
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi kata sandi baru tidak cocok");
        toast.error("Konfirmasi kata sandi baru tidak cocok");
        return;
      }

      // 4. Validasi password lama
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Sesi Anda telah berakhir. Silakan login kembali");
        toast.error("Sesi Anda telah berakhir. Silakan login kembali");
        router.push("/auth/signin");
        return;
      }

      // 5. Verifikasi password lama
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: oldPassword,
      });

      if (signInError) {
        setError("Kata sandi lama tidak valid");
        toast.error("Kata sandi lama tidak valid");
        return;
      }

      // 6. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError("Gagal memperbarui kata sandi");
        toast.error("Gagal memperbarui kata sandi");
        return;
      }

      // 7. Sukses
      toast.success("Kata sandi berhasil diperbarui");

      // 8. Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // 9. Redirect ke profile
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 2000);
    } catch (error) {
      console.error("Error saat update password:", error);
      setError("Terjadi kesalahan yang tidak diketahui");
      toast.error("Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <Toaster position="top-center" />

      <h1 className="text-2xl font-semibold text-center mb-6">
        Ubah Kata Sandi
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kata Sandi Lama
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-2 px-3 text-gray-600"
            placeholder="Masukkan kata sandi lama"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kata Sandi Baru
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-2 px-3 text-gray-600"
            placeholder="Masukkan kata sandi baru"
            required
            disabled={loading}
            minLength={8}
          />
          <p className="mt-1 text-sm text-gray-500">Minimal 8 karakter</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-2 px-3 text-gray-600"
            placeholder="Konfirmasi kata sandi baru"
            required
            disabled={loading}
            minLength={8}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/profile")}
            disabled={loading}
            className="px-4 py-2"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            {loading ? "Memperbarui..." : "Perbarui Kata Sandi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
