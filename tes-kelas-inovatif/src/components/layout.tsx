import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/app/navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  const { isLoading } = useAuth();

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-2xl font-bold">Loading...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
