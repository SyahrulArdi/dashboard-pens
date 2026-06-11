"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getProfilMahasiswa(mahasiswaId: string) {
  const { data: profil, error: profilError } = await supabaseAdmin
    .from("mahasiswa")
    .select("*")
    .eq("id", mahasiswaId)
    .maybeSingle();

  if (profilError) throw new Error(profilError.message);
  if (!profil) return null;

  const { data: perwalianData } = await supabaseAdmin
    .from("perwalian")
    .select(`
      dosen_wali (
        id, nama, nip, email
      )
    `)
    .eq("mahasiswa_id", mahasiswaId)
    .eq("status_aktif", true);

  return {
    ...profil,
    perwalian: perwalianData || [],
  };
}

export async function getNilaiMahasiswa(mahasiswaId: string) {
  const { data, error } = await supabaseAdmin
    .from("nilai_mahasiswa")
    .select(`
      *,
      mata_kuliah (
        nama_mk, sks
      )
    `)
    .eq("mahasiswa_id", mahasiswaId)
    .order("semester", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getPresensiMahasiswa(mahasiswaId: string) {
  const { data, error } = await supabaseAdmin
    .from("presensi_mahasiswa")
    .select(`
      *,
      mata_kuliah (
        nama_mk, sks
      )
    `)
    .eq("mahasiswa_id", mahasiswaId)
    .order("semester", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getRiwayatKRS(mahasiswaId: string) {
  const { data, error } = await supabaseAdmin
    .from("pengajuan_krs")
    .select("*")
    .eq("mahasiswa_id", mahasiswaId)
    .order("semester", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function submitKRS(formData: any) {
  const { data, error } = await supabaseAdmin
    .from("pengajuan_krs")
    .insert([
      {
        mahasiswa_id: formData.mahasiswa_id,
        semester: formData.semester,
        catatan_mahasiswa: formData.pesan_mahasiswa,
        status: "MENUNGGU",
      }
    ])
    .select();

  if (error) {
    if (error.code === '23505') {
      throw new Error("KRS untuk semester ini sudah pernah diajukan.");
    }
    throw new Error(error.message);
  }
  
  if (formData.dosen_wali_id) {
    await supabaseAdmin.from("notifikasi").insert([
      {
        dosen_wali_id: formData.dosen_wali_id,
        mahasiswa_id: formData.mahasiswa_id,
        jenis_kondisi: "KRS_DIAJUKAN",
        pesan: `Mahasiswa mengajukan persetujuan KRS untuk Semester ${formData.semester}.`,
        status: "BARU"
      }
    ]);
  }

  revalidatePath("/mahasiswa");
  return data;
}
