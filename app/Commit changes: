// app/lib/supabaseBrowser.ts
'use client';

import { createClient } from '@supabase/supabase-js';

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Export 1: cliente listo para usar con import { supabase } from '@/lib/supabaseBrowser'
export const supabase = client;

// Export 2: función que vos estás llamando en tus páginas
export function supabaseBrowser() {
  return client;
}
