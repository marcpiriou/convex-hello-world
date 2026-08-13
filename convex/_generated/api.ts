/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import { anyApi } from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_authz from "../lib/authz.js";
import type * as taskTypes from "../taskTypes.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "lib/authz": typeof lib_authz;
  taskTypes: typeof taskTypes;
  tasks: typeof tasks;
  users: typeof users;
}> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: FilterApi<typeof fullApi, FunctionReference<any, "public">> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">> = anyApi as any;
