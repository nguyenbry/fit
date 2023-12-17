import { z } from "zod";

// These are the roles that exist in auth.users table. I added my_admin.
// I don't know if "admin" exists already somewhere and I don't want to
// break anything. We'll change this later.
export const supabaseUserRole = z.enum(["my_admin", "authenticated"]);
export type SupabaseUserRole = z.infer<typeof supabaseUserRole>;
