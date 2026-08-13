import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** The currently signed-in user, or `null` if signed out. */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      return null;
    }
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      role: user.role ?? "user",
    };
  },
});
