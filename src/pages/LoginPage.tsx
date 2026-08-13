import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { HeroIllustration } from "../components/HeroIllustration";

type Portal = "user" | "admin";

const COPY: Record<
  Portal,
  { eyebrow: string; title: string; subtitle: string; tagline: string }
> = {
  user: {
    eyebrow: "Liste de tâches",
    title: "Organisez vos journées, une tâche à la fois",
    subtitle: "Connectez-vous pour retrouver vos tâches, où que vous soyez.",
    tagline: "Simple, rapide, toujours synchronisé.",
  },
  admin: {
    eyebrow: "Back office",
    title: "Configurez les types de tâches de votre équipe",
    subtitle: "Espace réservé aux administrateurs.",
    tagline: "Gérez les catégories utilisées par tous les utilisateurs.",
  },
};

export function LoginPage({ portal }: { portal: Portal }) {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading, user } = useCurrentUser();
  const navigate = useNavigate();

  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once signed in, send the visitor to the space matching their role,
  // regardless of which portal they logged in from.
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin" : "/tasks", { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const copy = COPY[portal];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn("password", {
        email: email.trim(),
        password,
        flow,
        ...(flow === "signUp" ? { name: name.trim(), role: portal } : {}),
      });
      // Navigation happens in the effect above once the viewer query resolves.
    } catch {
      setError(
        flow === "signUp"
          ? "Impossible de créer le compte. Vérifiez vos informations (mot de passe : 8 caractères minimum) ou l'email est peut-être déjà utilisé."
          : "Email ou mot de passe incorrect.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: illustration & pitch */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="text-white">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur">
            {copy.eyebrow}
          </span>
          <h1 className="mt-6 max-w-md text-3xl font-semibold leading-tight">{copy.title}</h1>
          <p className="mt-4 max-w-sm text-white/80">{copy.subtitle}</p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <HeroIllustration className="w-full" />
        </div>

        <p className="text-sm text-white/70">{copy.tagline}</p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-violet-700">
              {copy.eyebrow}
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">{copy.title}</h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {flow === "signIn" ? "Connexion" : "Créer un compte"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {portal === "admin"
                ? "Accès réservé au back office."
                : "Accédez à votre liste de tâches."}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {flow === "signUp" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Jane Dupont"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  placeholder="vous@exemple.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Veuillez patienter…"
                  : flow === "signIn"
                    ? "Se connecter"
                    : "Créer mon compte"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setFlow(flow === "signIn" ? "signUp" : "signIn");
              }}
              className="mt-5 w-full text-center text-sm text-slate-500 transition hover:text-violet-700"
            >
              {flow === "signIn"
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            {portal === "admin" ? (
              <>
                Vous êtes un utilisateur ?{" "}
                <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
                  Connexion classique
                </Link>
              </>
            ) : (
              <>
                Vous administrez cette instance ?{" "}
                <Link
                  to="/admin/login"
                  className="font-medium text-violet-600 hover:text-violet-700"
                >
                  Espace back office
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
