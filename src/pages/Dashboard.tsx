import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Marqait App</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Dashboard</h2>
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <h3 className="font-medium text-blue-900">
                Welcome to your dashboard!
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                You are now logged in and can access protected content.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">User Info</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Name: {user?.name}</p>
                  <p>Email: {user?.email}</p>
                  <p>ID: {user?.id}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">Quick Stats</h4>
                <p className="mt-2 text-sm text-gray-600">
                  This is a protected route that requires authentication.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">Actions</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Add your app content here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
