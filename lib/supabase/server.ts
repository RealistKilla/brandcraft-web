import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      async getAll() {
        const cookieStoreEntries = await cookieStore;
        return cookieStoreEntries.getAll();
      },
      async setAll(cookiesToSet) {
        const cookieStoreEntries = await cookieStore;
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStoreEntries.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
