import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Roles: "admin" can access the back office to configure task types,
// "user" can only manage their own personal task list.
export const roleValidator = v.union(v.literal("admin"), v.literal("user"));

export const taskStatusValidator = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("done"),
);

// Preset color palette used for task type badges throughout the UI.
export const taskTypeColorValidator = v.union(
  v.literal("slate"),
  v.literal("red"),
  v.literal("orange"),
  v.literal("amber"),
  v.literal("lime"),
  v.literal("emerald"),
  v.literal("teal"),
  v.literal("sky"),
  v.literal("blue"),
  v.literal("indigo"),
  v.literal("violet"),
  v.literal("fuchsia"),
  v.literal("pink"),
);

export default defineSchema({
  // Extend Convex Auth's default users table with a `role` field so we can
  // tell back-office admins and regular task-list users apart.
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(roleValidator),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  // Task types are configured by admins in the back office (e.g. "Bug",
  // "Feature", "Chore") and picked by users when creating a task.
  taskTypes: defineTable({
    name: v.string(),
    color: taskTypeColorValidator,
    description: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_name", ["name"]),

  // Each task belongs to exactly one user and optionally has a type.
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: taskStatusValidator,
    typeId: v.optional(v.id("taskTypes")),
    dueDate: v.optional(v.number()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_type", ["typeId"]),
});
