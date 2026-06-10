"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// ==========================================
// DATA MAHASISWA BINAAN
// ==========================================

export async function getMahasiswaBinaan(dosenWaliId: string) {
  const { data, error } = await supabaseAdmin
    .from("perwalian")
    .select(`
      mahasiswa:mahasiswa_id (
        id, nrp, nama, email, angkatan, program_studi,
        nilai_mahasiswa(id, nilai_angka, semester),
        presensi_mahasiswa(hadir, total_pertemuan)
      )
    `)
    .eq("dosen_wali_id", dosenWaliId)
    .eq("status_aktif", true);

  if (error) throw new Error(error.message);
  
  // Transform and calculate IPK/Kehadiran summary
  return data.map((item: any) => {
    const m = item.mahasiswa;
    const nilais = m.nilai_mahasiswa || [];
    const presensis = m.presensi_mahasiswa || [];
    
    // IPK calculation (simplified: average of nilai_angka)
    const ipk = nilais.length > 0 
      ? nilais.reduce((sum: number, n: any) => sum + Number(n.nilai_angka), 0) / nilais.length 
      : 0;

    // Presensi calculation
    const totalHadir = presensis.reduce((sum: number, p: any) => sum + p.hadir, 0);
    const totalPertemuan = presensis.reduce((sum: number, p: any) => sum + p.total_pertemuan, 0);
    const persentaseKehadiran = totalPertemuan > 0 ? (totalHadir / totalPertemuan) * 100 : 100;

    return {
      ...m,
      ipk: Number(ipk.toFixed(2)),
      persentase_kehadiran: Math.round(persentaseKehadiran)
    };
  });
}

export async function getDetailMahasiswaBinaan(mahasiswaId: string, dosenWaliId: string) {
  // Verifikasi apakah ini mahasiswa binaannya
  const { data: perwalian, error: errPerwalian } = await supabaseAdmin
    .from("perwalian")
    .select("id")
    .eq("dosen_wali_id", dosenWaliId)
    .eq("mahasiswa_id", mahasiswaId)
    .single();

  if (errPerwalian || !perwalian) throw new Error("Mahasiswa bukan binaan Anda.");

  const { data, error } = await supabaseAdmin
    .from("mahasiswa")
    .select(`
      *,
      nilai_mahasiswa(*, mata_kuliah(nama_mk, sks)),
      presensi_mahasiswa(*, mata_kuliah(nama_mk, sks)),
      pengajuan_krs(*)
    `)
    .eq("id", mahasiswaId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ==========================================
// KRS
// ==========================================

export async function getPengajuanKRSBinaan(dosenWaliId: string) {
  const { data: mhsBinaan, error: errMhs } = await supabaseAdmin
    .from("perwalian")
    .select("mahasiswa_id")
    .eq("dosen_wali_id", dosenWaliId)
    .eq("status_aktif", true);

  if (errMhs) throw new Error(errMhs.message);
  const mhsIds = mhsBinaan.map(m => m.mahasiswa_id);

  if (mhsIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("pengajuan_krs")
    .select(`
      *,
      mahasiswa (id, nama, nrp, angkatan)
    `)
    .in("mahasiswa_id", mhsIds)
    .order("diajukan_pada", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateStatusKRS(id: string, status: string, catatan: string) {
  const { error } = await supabaseAdmin
    .from("pengajuan_krs")
    .update({ 
      status: status, // MENUNGGU, DISETUJUI, DITOLAK
      catatan_dosen: catatan 
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dosenwali/krs");
}

// ==========================================
// NOTIFIKASI & PENGATURAN
// ==========================================

export async function getNotifikasiDosen(dosenWaliId: string) {
  const { data, error } = await supabaseAdmin
    .from("notifikasi")
    .select(`
      *,
      mahasiswa (id, nama, nrp)
    `)
    .eq("dosen_wali_id", dosenWaliId)
    .order("dibangkitkan_pada", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function tandaiNotifikasiDibaca(id: string) {
  const { error } = await supabaseAdmin
    .from("notifikasi")
    .update({ status: "DIBACA" })
    .eq("id", id)
    .eq("status", "BARU");

  if (error) throw new Error(error.message);
  revalidatePath("/dosenwali");
}

export async function tindakLanjutiNotifikasi(notifikasiId: string, dosenWaliId: string, catatan: string) {
  const { error: err1 } = await supabaseAdmin
    .from("riwayat_tindak_lanjut")
    .insert({
      notifikasi_id: notifikasiId,
      dosen_wali_id: dosenWaliId,
      catatan_tindakan: catatan
    });

  if (err1) throw new Error(err1.message);

  const { error: err2 } = await supabaseAdmin
    .from("notifikasi")
    .update({ status: "DITINDAKLANJUTI" })
    .eq("id", notifikasiId);

  if (err2) throw new Error(err2.message);

  revalidatePath("/dosenwali/notifikasi");
}

export async function getKonfigurasi(dosenWaliId: string) {
  const { data, error } = await supabaseAdmin
    .from("konfigurasi_notifikasi")
    .select("*")
    .eq("dosen_wali_id", dosenWaliId)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message); // PGRST116 is not found
  return data;
}

export async function saveKonfigurasi(dosenWaliId: string, config: any) {
  const { data: existing } = await supabaseAdmin
    .from("konfigurasi_notifikasi")
    .select("id")
    .eq("dosen_wali_id", dosenWaliId)
    .single();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("konfigurasi_notifikasi")
      .update(config)
      .eq("dosen_wali_id", dosenWaliId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("konfigurasi_notifikasi")
      .insert({ ...config, dosen_wali_id: dosenWaliId });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dosenwali/pengaturan");
}

// ==========================================
// LAPORAN PPKS
// ==========================================

export async function laporPPKS(data: {
  mahasiswa_id: string,
  pelapor_id: string,
  jenis_laporan: string,
  deskripsi: string
}) {
  const { error } = await supabaseAdmin
    .from("laporan_ppks")
    .insert({
      mahasiswa_id: data.mahasiswa_id,
      pelapor_id: data.pelapor_id,
      jenis_laporan: data.jenis_laporan,
      deskripsi: data.deskripsi,
      status: "DITERIMA"
    });

  if (error) throw new Error(error.message);
  revalidatePath("/dosenwali/bermasalah");
}

// ==========================================
// SKEM
// ==========================================

export async function getSkemMahasiswaBinaan(dosenWaliId: string) {
  const { data: mhsBinaan, error: errMhs } = await supabaseAdmin
    .from("perwalian")
    .select("mahasiswa_id")
    .eq("dosen_wali_id", dosenWaliId)
    .eq("status_aktif", true);

  if (errMhs) throw new Error(errMhs.message);
  const mhsIds = mhsBinaan.map(m => m.mahasiswa_id);

  if (mhsIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("mahasiswa")
    .select(`
      id, nrp, nama,
      skem_mahasiswa(id, kategori, nama_kegiatan, poin, status, tanggal_kegiatan)
    `)
    .in("id", mhsIds)
    .order("nama", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
