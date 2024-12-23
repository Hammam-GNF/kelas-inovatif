"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Ambil data profil saat komponen dimuat
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 1. Dapatkan user saat ini
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Sesi tidak valid");
      }

      // 2. Ambil data profil dari database
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error("Gagal mengambil data profil");
      }

      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error: any) {
      console.error("Error mengambil profil:", error);
      setError(error.message);
      toast.error(error.message);

      if (error.message === "Sesi tidak valid") {
        router.push("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maksimal 5MB)");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    setAvatarFile(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !profile) return null;

    try {
      setUploadingAvatar(true);

      // 1. Upload file ke storage
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (uploadError) {
        throw new Error("Gagal mengupload avatar");
      }

      // 2. Dapatkan URL publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error upload avatar:", error);
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile) throw new Error("Profil tidak ditemukan");

      let avatarUrl = profile.avatar_url;

      // Upload avatar baru jika ada
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Update profil di database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...editedProfile,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        throw new Error("Gagal memperbarui profil");
      }

      // Refresh data profil
      await fetchProfile();

      toast.success("Profil berhasil diperbarui");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error update profil:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Memuat...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profil Pengguna</h1>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Profil
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-2xl">
                  {profile?.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-gray-500 mt-2">
              Klik untuk mengubah foto profil
            </p>
          )}
        </div>

        {/* Informasi Profil */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.full_name || ""}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    full_name: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 py-2 px-3"
                required
              />
            ) : (
              <p className="text-gray-900">{profile?.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{profile?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900 capitalize">{profile?.role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bergabung Sejak
            </label>
            <p className="text-gray-900">
              {new Date(profile?.created_at || "").toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Tombol Aksi */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedProfile(profile || {});
              }}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || uploadingAvatar}
            >
              {loading || uploadingAvatar ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        )}
      </form>

      {/* Tombol Reset Password */}
      <div className="mt-8 pt-6 border-t">
        <Button
          onClick={() => router.push("/dashboard/reset-password")}
          variant="outline"
          className="w-full"
        >
          Ubah Kata Sandi
        </Button>
      </div>
    </div>
  );
}
