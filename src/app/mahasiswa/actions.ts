"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getProfilMahasiswa(mahasiswaId: string) {
  // Join mahasiswa with perwalian to get dosen wali name
  const { data, error } = await supabaseAdmin
    .from("mahasiswa")
    .select(`
      *,
      perwalian (
        dosen_wali (
          nama, nip, email
        )
      )
    `)
    .eq("id", mahasiswaId)
    .single();

  if (error) throw new Error(error.message);
  return data;
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
        file_krs_url: formData.file_krs_url,
        pesan_mahasiswa: formData.pesan_mahasiswa,
        status_persetujuan: "PENDING"
      }
    ])
    .select();

  if (error) throw new Error(error.message);
  
  // Create notification for Dosen Wali
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
