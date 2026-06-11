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
        id, nrp, nama, email, angkatan, program_studi
      )
    `)
    .eq("dosen_wali_id", dosenWaliId)
    .eq("status_aktif", true);

  if (error) throw new Error(error.message);

  const mahasiswaList = data.map((item: any) => item.mahasiswa).filter(Boolean);

  // Ambil IPK terbaru dari ipk_per_semester dan hitung kehadiran
  const enriched = await Promise.all(
    mahasiswaList.map(async (m: any) => {
      // IPK terbaru
      const { data: ipkData } = await supabaseAdmin
        .from("ipk_per_semester")
        .select("ipk, semester")
        .eq("mahasiswa_id", m.id)
        .order("semester", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Presensi untuk hitung persentase kehadiran
      const { data: presensiData } = await supabaseAdmin
        .from("presensi_mahasiswa")
        .select("hadir, total_pertemuan")
        .eq("mahasiswa_id", m.id);

      const totalHadir = (presensiData || []).reduce((s: number, p: any) => s + p.hadir, 0);
      const totalPertemuan = (presensiData || []).reduce((s: number, p: any) => s + p.total_pertemuan, 0);
      const persentaseKehadiran = totalPertemuan > 0 ? Math.round((totalHadir / totalPertemuan) * 100) : 100;

      return {
        ...m,
        ipk: Number((ipkData?.ipk ?? 0).toFixed(2)),
        semester_terbaru: ipkData?.semester ?? 0,
        persentase_kehadiran: persentaseKehadiran,
      };
    })
  );

  return enriched;
}

export async function getMahasiswaBermasalah(dosenWaliId: string) {
  // Ambil konfigurasi threshold
  const { data: config } = await supabaseAdmin
    .from("konfigurasi_notifikasi")
    .select("ambang_ipk, ambang_kehadiran_persen")
    .eq("dosen_wali_id", dosenWaliId)
    .maybeSingle();

  const ambangIPK = Number(config?.ambang_ipk ?? 2.50);
  const ambangKehadiran = Number(config?.ambang_kehadiran_persen ?? 75);

  const semua = await getMahasiswaBinaan(dosenWaliId);

  return semua
    .filter((m: any) => m.ipk < ambangIPK || m.persentase_kehadiran < ambangKehadiran)
    .map((m: any) => {
      const masalah: string[] = [];
      if (m.ipk < ambangIPK) masalah.push("IPK Rendah");
      if (m.persentase_kehadiran < ambangKehadiran) masalah.push("Kehadiran Buruk");
      return { ...m, masalah };
    });
}

export async function getDetailMahasiswaLengkap(mahasiswaId: string, dosenWaliId: string) {
  // Verifikasi perwalian
  const { data: perwalian } = await supabaseAdmin
    .from("perwalian")
    .select("id")
    .eq("dosen_wali_id", dosenWaliId)
    .eq("mahasiswa_id", mahasiswaId)
    .maybeSingle();

  if (!perwalian) throw new Error("Mahasiswa bukan binaan Anda.");

  const [profil, nilai, presensi, ipkHistory, skem] = await Promise.all([
    supabaseAdmin.from("mahasiswa").select("*").eq("id", mahasiswaId).single(),
    supabaseAdmin.from("nilai_mahasiswa").select("*, mata_kuliah(nama_mk, sks)").eq("mahasiswa_id", mahasiswaId).order("semester", { ascending: false }),
    supabaseAdmin.from("presensi_mahasiswa").select("*, mata_kuliah(nama_mk)").eq("mahasiswa_id", mahasiswaId).order("semester", { ascending: false }),
    supabaseAdmin.from("ipk_per_semester").select("*").eq("mahasiswa_id", mahasiswaId).order("semester", { ascending: true }),
    supabaseAdmin.from("skem_mahasiswa").select("*").eq("mahasiswa_id", mahasiswaId).order("dibuat_pada", { ascending: false }),
  ]);

  return {
    profil: profil.data,
    nilai: nilai.data || [],
    presensi: presensi.data || [],
    ipkHistory: ipkHistory.data || [],
    skem: skem.data || [],
  };
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
  const mhsIds = mhsBinaan.map((m: any) => m.mahasiswa_id);

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
      status,
      catatan_dosen: catatan,
      diproses_pada: new Date().toISOString(),
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
  revalidatePath("/dosenwali/notifikasi");
}

export async function tindakLanjutiNotifikasi(notifikasiId: string, dosenWaliId: string, catatan: string) {
  const { error: err1 } = await supabaseAdmin
    .from("riwayat_tindak_lanjut")
    .insert({
      notifikasi_id: notifikasiId,
      dosen_wali_id: dosenWaliId,
      catatan_tindakan: catatan,
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
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function saveKonfigurasi(dosenWaliId: string, config: any) {
  const { data: existing } = await supabaseAdmin
    .from("konfigurasi_notifikasi")
    .select("id")
    .eq("dosen_wali_id", dosenWaliId)
    .maybeSingle();

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
// EVALUASI KONDISI OTOMATIS
// ==========================================

export async function evaluasiKondisiAkademik(dosenWaliId: string) {
  const { data: config } = await supabaseAdmin
    .from("konfigurasi_notifikasi")
    .select("ambang_ipk, ambang_kehadiran_persen, aktif")
    .eq("dosen_wali_id", dosenWaliId)
    .maybeSingle();

  if (!config || !config.aktif) return { inserted: 0 };

  const ambangIPK = Number(config.ambang_ipk ?? 2.50);
  const ambangKehadiran = Number(config.ambang_kehadiran_persen ?? 75);

  const semua = await getMahasiswaBinaan(dosenWaliId);
  let inserted = 0;

  for (const m of semua) {
    // Cek IPK rendah
    if (m.ipk < ambangIPK && m.ipk > 0) {
      // Cek apakah notifikasi IPK sudah ada (dalam 7 hari terakhir)
      const { data: existing } = await supabaseAdmin
        .from("notifikasi")
        .select("id")
        .eq("dosen_wali_id", dosenWaliId)
        .eq("mahasiswa_id", m.id)
        .eq("jenis_kondisi", "IPK_TURUN")
        .gte("dibangkitkan_pada", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

      if (!existing) {
        await supabaseAdmin.from("notifikasi").insert({
          dosen_wali_id: dosenWaliId,
          mahasiswa_id: m.id,
          jenis_kondisi: "IPK_TURUN",
          pesan: `IPK ${m.nama} sebesar ${m.ipk.toFixed(2)} di bawah ambang batas ${ambangIPK.toFixed(2)}. Perlu perhatian segera.`,
          status: "BARU",
        });
        inserted++;
      }
    }

    // Cek kehadiran buruk
    if (m.persentase_kehadiran < ambangKehadiran) {
      const { data: existing } = await supabaseAdmin
        .from("notifikasi")
        .select("id")
        .eq("dosen_wali_id", dosenWaliId)
        .eq("mahasiswa_id", m.id)
        .eq("jenis_kondisi", "KEHADIRAN_BURUK")
        .gte("dibangkitkan_pada", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

      if (!existing) {
        await supabaseAdmin.from("notifikasi").insert({
          dosen_wali_id: dosenWaliId,
          mahasiswa_id: m.id,
          jenis_kondisi: "KEHADIRAN_BURUK",
          pesan: `Kehadiran ${m.nama} sebesar ${m.persentase_kehadiran}% di bawah ambang batas ${ambangKehadiran}%.`,
          status: "BARU",
        });
        inserted++;
      }
    }
  }

  revalidatePath("/dosenwali/notifikasi");
  revalidatePath("/dosenwali");
  return { inserted };
}

// ==========================================
// LAPORAN PPKS
// ==========================================

export async function laporPPKS(data: {
  mahasiswa_id: string;
  pelapor_id: string;
  jenis_laporan: string;
  deskripsi: string;
}) {
  const { error } = await supabaseAdmin.from("laporan_ppks").insert({
    mahasiswa_id: data.mahasiswa_id,
    pelapor_id: data.pelapor_id,
    jenis_laporan: data.jenis_laporan,
    deskripsi: data.deskripsi,
    status: "DITERIMA",
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
  const mhsIds = mhsBinaan.map((m: any) => m.mahasiswa_id);

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

// ==========================================
// SEMESTER ANTARA
// ==========================================

export async function getSemesterAntaraBinaan(dosenWaliId: string) {
  const { data: mhsBinaan } = await supabaseAdmin
    .from("perwalian")
    .select("mahasiswa_id")
    .eq("dosen_wali_id", dosenWaliId)
    .eq("status_aktif", true);

  if (!mhsBinaan || mhsBinaan.length === 0) return [];
  const mhsIds = mhsBinaan.map((m: any) => m.mahasiswa_id);

  const { data, error } = await supabaseAdmin
    .from("semester_antara")
    .select(`
      *,
      mahasiswa (id, nrp, nama, angkatan),
      semester_antara_matkul (
        kode_mk,
        mata_kuliah (nama_mk, sks)
      )
    `)
    .in("mahasiswa_id", mhsIds)
    .order("dibuat_pada", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}
