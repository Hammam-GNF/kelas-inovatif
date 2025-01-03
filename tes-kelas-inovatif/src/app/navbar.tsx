"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createServerClient } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string | undefined } | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { email: user.email } : null);
    };

    fetchUser();
  }, []);

  const signOut = async () => {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold">Logo</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/dashboard"
            className={`text-sm font-semibold leading-6 ${
              pathname === "/dashboard"
                ? "text-blue-600"
                : "text-gray-900 hover:text-gray-600"
            }`}
          >
            Dashboard
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {user ? (
            <div className="flex items-center gap-x-4">
              <span className="text-sm font-semibold text-gray-900">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm font-semibold text-gray-900 hover:text-gray-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-x-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/dashboard"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-900 hover:bg-gray-50"
              }`}
              onClick={toggleMobileMenu}
            >
              Dashboard
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-6">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
