import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireUserId } from "./lib/authz";
import { taskTypeColorValidator } from "./schema";

/**
 * Every signed-in user can read the list of task types (they need it to
 * label their tasks), but only admins can create/edit/delete them from the
 * back office.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    return await ctx.db.query("taskTypes").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: taskTypeColorValidator,
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const name = args.name.trim();
    if (name.length === 0) {
      throw new Error("Le nom du type de tâche est requis");
    }
    return await ctx.db.insert("taskTypes", {
      name,
      color: args.color,
      description: args.description?.trim() || undefined,
      createdBy: admin._id,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("taskTypes"),
    name: v.optional(v.string()),
    color: v.optional(taskTypeColorValidator),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...rest } = args;
    const patch: Record<string, unknown> = { ...rest };
    if (typeof patch.name === "string") {
      patch.name = patch.name.trim();
    }
    if (typeof patch.description === "string") {
      patch.description = patch.description.trim() || undefined;
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("taskTypes") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Detach the type from any task currently using it instead of leaving
    // dangling references.
    const affected = await ctx.db
      .query("tasks")
      .withIndex("by_type", (q) => q.eq("typeId", args.id))
      .collect();
    for (const task of affected) {
      await ctx.db.patch(task._id, { typeId: undefined });
    }
    await ctx.db.delete(args.id);
  },
});
