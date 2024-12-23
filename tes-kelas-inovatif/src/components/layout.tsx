"use client";
import { useAuth } from "@/providers/AuthProvider";
import AuthLoading from "@/components/auth/auth-loading";
import Navbar from "@/app/navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
