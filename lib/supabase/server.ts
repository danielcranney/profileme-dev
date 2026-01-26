/**
 * Supabase Server Client (Pages Router)
 * 
 * Creates a Supabase client for use in API routes (Pages Router).
 * Handles cookies for session management via req/res.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Database } from "./types";

export function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader(
            "Set-Cookie",
            `${name}=${value}; Path=${options.path || "/"}; ${
              options.maxAge ? `Max-Age=${options.maxAge}; ` : ""
            }${options.httpOnly ? "HttpOnly; " : ""}${
              options.secure ? "Secure; " : ""
            }${options.sameSite ? `SameSite=${options.sameSite}; ` : ""}`
          );
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader(
            "Set-Cookie",
            `${name}=; Path=${options.path || "/"}; Max-Age=0; ${
              options.httpOnly ? "HttpOnly; " : ""
            }${options.secure ? "Secure; " : ""}${
              options.sameSite ? `SameSite=${options.sameSite}; ` : ""
            }`
          );
        },
      },
    }
  );
}
