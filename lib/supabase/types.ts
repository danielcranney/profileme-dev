/**
 * Supabase Database Types
 * 
 * This file can be auto-generated from your Supabase project.
 * For now, we'll use a minimal type definition since we're only using auth.
 * 
 * To generate types:
 * npx supabase gen types typescript --project-id <project-id> > lib/supabase/types.ts
 */

export type Database = {
  public: {
    Tables: Record<string, never>; // No custom tables - auth only
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
