"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function validateUserExists(userId: string, role: string): Promise<boolean> {
  const tableMap: Record<string, string> = {
    admin: "admin",
    dosen_wali: "dosen_wali",
    mahasiswa: "mahasiswa",
    ppks: "ppks",
  };

  const table = tableMap[role];
  if (!table) return false;

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}
