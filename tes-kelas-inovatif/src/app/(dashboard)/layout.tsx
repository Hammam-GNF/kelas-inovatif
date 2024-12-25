import { createServerClient } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
