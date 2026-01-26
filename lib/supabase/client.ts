/**
 * Supabase Client (Browser)
 * 
 * Creates a Supabase client for use in browser/client components.
 * This client is used for client-side operations like sign-in/sign-out.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient() should only be called in browser context");
  }

  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }

    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return clientInstance;
}
