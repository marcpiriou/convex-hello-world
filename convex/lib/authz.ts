import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/** Returns the signed-in user's id, or throws if not authenticated. */
export async function requireUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}

/** Returns the signed-in user's document, or throws if not authenticated. */
export async function requireUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const userId = await requireUserId(ctx);
  const user = await ctx.db.get(userId);
  if (user === null) {
    throw new Error("Not authenticated");
  }
  return user;
}

/**
 * Returns the signed-in user's document, throwing unless they have the
 * "admin" role. Use this to guard back-office mutations/queries.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "admin") {
    throw new Error("Forbidden: this action requires an administrator account");
  }
  return user;
}
