"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getLaporanPPKS() {
  const { data, error } = await supabaseAdmin
    .from("laporan_ppks")
    .select(`
      *,
      mahasiswa (id, nrp, nama, program_studi),
      dosen_wali:pelapor_id (id, nama)
    `)
    .order("dibuat_pada", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateStatusLaporanPPKS(id: string, status: string, tindak_lanjut: string) {
  const { error } = await supabaseAdmin
    .from("laporan_ppks")
    .update({ 
      status, 
      tindak_lanjut,
      diupdate_pada: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/ppks");
}
