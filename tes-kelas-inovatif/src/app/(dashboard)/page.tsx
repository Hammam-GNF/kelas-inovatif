import { createServerClient } from "@/lib/auth";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session?.user.email}!
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">
          This is your dashboard. You can start adding content here.
        </p>
      </div>
    </div>
  );
}
