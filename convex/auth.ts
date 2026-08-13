import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      // Called once, when an account is created via the "signUp" flow.
      // The login page passes an extra `role` field depending on which
      // portal the visitor signed up from ("/login" vs "/admin/login"),
      // which we persist on the user document.
      profile(params) {
        const email = params.email as string;
        const role = params.role === "admin" ? ("admin" as const) : ("user" as const);
        const name = (params.name as string | undefined)?.trim();
        return name ? { email, name, role } : { email, role };
      },
    }),
  ],
});
