import { useAuth } from "@/providers/AuthProvider";
import AuthLoading from "@/components/auth/auth-loading"; // Ensure this path is correct
import Navbar from "@/app/navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  const { loading } = useAuth();

  return loading ? (
    <AuthLoading />
  ) : (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
