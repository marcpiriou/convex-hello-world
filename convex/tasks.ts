import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/authz";
import { taskStatusValidator } from "./schema";

/** The signed-in user's own tasks, most recently created first. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Join in the task type so the UI doesn't need N extra queries.
    const typeIds = new Set(
      tasks.map((t) => t.typeId).filter((id): id is NonNullable<typeof id> => id !== undefined),
    );
    const types = new Map(
      await Promise.all(
        Array.from(typeIds).map(async (id) => [id, await ctx.db.get(id)] as const),
      ),
    );

    return tasks.map((task) => ({
      ...task,
      type: task.typeId ? (types.get(task.typeId) ?? null) : null,
    }));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    typeId: v.optional(v.id("taskTypes")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const title = args.title.trim();
    if (title.length === 0) {
      throw new Error("Le titre de la tâche est requis");
    }
    return await ctx.db.insert("tasks", {
      title,
      description: args.description?.trim() || undefined,
      typeId: args.typeId,
      dueDate: args.dueDate,
      status: "todo",
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    typeId: v.optional(v.id("taskTypes")),
    dueDate: v.optional(v.number()),
    status: v.optional(taskStatusValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const { id, ...rest } = args;
    const existing = await ctx.db.get(id);
    if (existing === null || existing.userId !== userId) {
      throw new Error("Tâche introuvable");
    }
    const patch: Record<string, unknown> = { ...rest };
    if (typeof patch.title === "string") {
      patch.title = patch.title.trim();
    }
    if (typeof patch.description === "string") {
      patch.description = patch.description.trim() || undefined;
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing === null || existing.userId !== userId) {
      throw new Error("Tâche introuvable");
    }
    await ctx.db.delete(args.id);
  },
});
