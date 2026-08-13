import { Link, useLocation } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function AppHeader() {
  const { signOut } = useAuthActions();
  const { user } = useCurrentUser();
  const location = useLocation();
  const onAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              ✓
            </span>
            Mes tâches
          </span>
          {user?.role === "admin" && (
            <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-sm">
              <Link
                to="/tasks"
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  !onAdmin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Mes tâches
              </Link>
              <Link
                to="/admin"
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  onAdmin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Back office
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
