import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Spinner } from "./Spinner";

export function ProtectedRoute({
  children,
  requireRole,
}: {
  children: ReactNode;
  /** Restrict access to a specific role (e.g. "admin" for the back office). */
  requireRole?: "admin";
}) {
  const { isLoading, isAuthenticated, user } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={requireRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Accès restreint</h1>
          <p className="mt-2 text-sm text-slate-600">
            Cette section est réservée aux administrateurs du back office.
            Votre compte n&apos;a pas les droits nécessaires.
          </p>
          <a
            href="/tasks"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Retour à ma liste de tâches
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
