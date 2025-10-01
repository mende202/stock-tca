import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para el navegador (usa la ANON KEY)
export const supabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
