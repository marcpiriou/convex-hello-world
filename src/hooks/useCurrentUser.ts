import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Combines Convex Auth's own loading/authenticated state with the `viewer`
 * query so components can tell apart three states: still loading, signed
 * out, or signed in (with the user's role).
 */
export function useCurrentUser() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");

  const isLoading = authLoading || (isAuthenticated && viewer === undefined);

  return {
    isLoading,
    isAuthenticated,
    user: viewer ?? null,
  };
}
