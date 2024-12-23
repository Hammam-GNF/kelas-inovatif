"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check credentials with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("Email logins are disabled")) {
          setError(
            "Email sign in is not enabled. Please contact administrator."
          );
        } else if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password");
        } else {
          setError(authError.message);
        }
        return;
      }

      if (!data.user) {
        setError("User not found");
        return;
      }

      // If successful, show success message and redirect
      toast.success("Signed in successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(
        error?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-200 py-10">
        <div className="flex shadow-md">
          {/* Login form */}
          <div
            className="flex flex-wrap content-center justify-center rounded-l-md bg-white"
            style={{ width: "24rem", height: "32rem" }}
          >
            <div className="w-72">
              {/* Heading */}
              <h1 className="text-xl font-semibold">Welcome back</h1>
              <small className="text-gray-400">
                Welcome back! Please enter your details
              </small>

              {message && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs rounded">
                  {message}
                </div>
              )}
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="*****"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="mb-1.5 block w-full text-center text-white bg-purple-700 hover:bg-purple-900 px-2 py-1.5 rounded-md transition"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard" })
                    }
                    className="flex flex-wrap justify-center w-full border border-gray-300 hover:border-gray-500 px-2 py-1.5 rounded-md transition"
                  >
                    <img
                      className="w-5 mr-2"
                      src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                      alt="Google"
                    />
                    Sign in with Google
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center">
                <span className="text-xs text-gray-400 font-semibold">
                  Don't have account?{" "}
                </span>
                <Link
                  href="/auth/signup"
                  className="text-xs font-semibold text-purple-700 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Login banner */}
          <div
            className="flex flex-wrap content-center justify-center rounded-r-md"
            style={{ width: "24rem", height: "32rem" }}
          >
            <img
              className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md"
              src="https://i.imgur.com/9l1A4OS.jpeg"
              alt="Login banner"
            />
          </div>
        </div>
      </div>
    </>
  );
}
