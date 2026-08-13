/**
 * Preset palette for task type badges. Keep in sync with
 * `taskTypeColorValidator` in convex/schema.ts.
 */
export const TASK_TYPE_COLORS = [
  "slate",
  "red",
  "orange",
  "amber",
  "lime",
  "emerald",
  "teal",
  "sky",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
  "pink",
] as const;

export type TaskTypeColor = (typeof TASK_TYPE_COLORS)[number];

// Tailwind class names must appear as full literal strings somewhere in the
// source for the compiler to pick them up, hence this explicit map instead
// of string interpolation.
const BADGE_CLASSES: Record<TaskTypeColor, string> = {
  slate: "bg-slate-100 text-slate-700 ring-slate-600/20",
  red: "bg-red-100 text-red-700 ring-red-600/20",
  orange: "bg-orange-100 text-orange-700 ring-orange-600/20",
  amber: "bg-amber-100 text-amber-800 ring-amber-600/20",
  lime: "bg-lime-100 text-lime-800 ring-lime-600/20",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  teal: "bg-teal-100 text-teal-700 ring-teal-600/20",
  sky: "bg-sky-100 text-sky-700 ring-sky-600/20",
  blue: "bg-blue-100 text-blue-700 ring-blue-600/20",
  indigo: "bg-indigo-100 text-indigo-700 ring-indigo-600/20",
  violet: "bg-violet-100 text-violet-700 ring-violet-600/20",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-600/20",
  pink: "bg-pink-100 text-pink-700 ring-pink-600/20",
};

const DOT_CLASSES: Record<TaskTypeColor, string> = {
  slate: "bg-slate-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  lime: "bg-lime-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
};

export function badgeClasses(color: string): string {
  return BADGE_CLASSES[color as TaskTypeColor] ?? BADGE_CLASSES.slate;
}

export function dotClasses(color: string): string {
  return DOT_CLASSES[color as TaskTypeColor] ?? DOT_CLASSES.slate;
}
