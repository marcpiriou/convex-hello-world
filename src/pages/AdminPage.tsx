import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { AppHeader } from "../components/AppHeader";
import { Spinner } from "../components/Spinner";
import { TASK_TYPE_COLORS, badgeClasses, dotClasses } from "../lib/taskTypeColors";
import type { TaskTypeColor } from "../lib/taskTypeColors";

export function AdminPage() {
  const taskTypes = useQuery(api.taskTypes.list);
  const createTaskType = useMutation(api.taskTypes.create);
  const removeTaskType = useMutation(api.taskTypes.remove);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<TaskTypeColor>("violet");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createTaskType({ name, description: description || undefined, color });
      setName("");
      setDescription("");
      setColor("violet");
    } catch {
      setError("Impossible de créer ce type de tâche.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Back office</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configurez les types de tâches proposés aux utilisateurs de la liste de tâches.
        </p>

        <form
          onSubmit={handleCreate}
          className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type-name" className="block text-sm font-medium text-slate-700">
                Nom
              </label>
              <input
                id="type-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bug, Fonctionnalité, Tâche…"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>
            <div>
              <label htmlFor="type-description" className="block text-sm font-medium text-slate-700">
                Description (optionnelle)
              </label>
              <input
                id="type-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Courte description"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700">Couleur</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TASK_TYPE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={c}
                  className={`h-7 w-7 rounded-full ${dotClasses(c)} transition ring-2 ring-offset-2 ${
                    color === c ? "ring-slate-900" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ajouter le type
          </button>
        </form>

        <div className="mt-8">
          {taskTypes === undefined ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : taskTypes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
              Aucun type de tâche configuré. Ajoutez-en un ci-dessus.
            </p>
          ) : (
            <ul className="space-y-2">
              {taskTypes.map((t) => (
                <li
                  key={t._id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClasses(t.color)}`}
                    >
                      {t.name}
                    </span>
                    {t.description && (
                      <p className="mt-1 text-sm text-slate-500">{t.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeTaskType({ id: t._id as Id<"taskTypes"> })}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
