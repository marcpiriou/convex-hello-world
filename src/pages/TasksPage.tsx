import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { AppHeader } from "../components/AppHeader";
import { Spinner } from "../components/Spinner";
import { badgeClasses } from "../lib/taskTypeColors";

const STATUS_LABEL: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
};

const STATUS_ORDER = ["todo", "in_progress", "done"] as const;

export function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const taskTypes = useQuery(api.taskTypes.list);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createTask({
        title,
        typeId: typeId ? (typeId as Id<"taskTypes">) : undefined,
      });
      setTitle("");
      setTypeId("");
    } catch {
      setError("Impossible de créer la tâche.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Ma liste de tâches</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ajoutez une tâche, assignez-lui un type et suivez son avancement.
        </p>

        <form
          onSubmit={handleCreate}
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nouvelle tâche…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
          <select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          >
            <option value="">Sans type</option>
            {taskTypes?.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ajouter
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-8">
          {tasks === undefined ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : tasks.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
              Aucune tâche pour le moment. Ajoutez-en une ci-dessus !
            </p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        void updateTask({
                          id: task._id,
                          status: task.status === "done" ? "todo" : "done",
                        })
                      }
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition ${
                        task.status === "done"
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 text-transparent hover:border-violet-400"
                      }`}
                      aria-label="Marquer comme terminée"
                    >
                      ✓
                    </button>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          task.status === "done" ? "text-slate-400 line-through" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.type && (
                        <span
                          className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClasses(task.type.color)}`}
                        >
                          {task.type.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        void updateTask({
                          id: task._id,
                          status: e.target.value as "todo" | "in_progress" | "done",
                        })
                      }
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void removeTask({ id: task._id })}
                      className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
