import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client untuk operasi publik (terkena RLS jika aktif)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client dengan hak istimewa (melewati RLS) - Hanya boleh dipanggil di API routes/Server Actions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
