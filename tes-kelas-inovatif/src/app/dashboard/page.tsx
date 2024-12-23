import { requireAuth } from "@/lib/auth-utils";

export default async function Dashboard() {
  const session = await requireAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome, {session.user.name}!
            </h2>
            <p className="mt-2 text-gray-600">
              You are signed in with {session.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
