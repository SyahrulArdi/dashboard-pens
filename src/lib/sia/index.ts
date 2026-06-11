import { supabaseAdmin } from "../supabase";

export type MahasiswaSIA = {
  id: string;
  nrp: string;
  nama: string;
  angkatan: number;
  program_studi: string;
  ipk_sekarang: number;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'DO';
};

export type NilaiMatkul = {
  kode_mk: string;
  nama_mk: string;
  sks: number;
  nilai_angka: number;
  nilai_huruf: string;
  semester: number;
};

export type PresensiMatkul = {
  kode_mk: string;
  nama_mk: string;
  total_pertemuan: number;
  hadir: number;
  persentase: number;
};

export type IpkHistory = {
  semester: number;
  ips: number;
  ipk: number;
  tahun_akademik?: string;
};

export type SemesterAntaraParticipant = {
  mahasiswa_id: string;
  mahasiswa_nama?: string;
  mahasiswa_nrp?: string;
  tahun_akademik: string;
  keterangan?: string;
  mata_kuliah: { kode_mk: string; nama_mk: string; sks: number }[];
};

export const siaClient = {
  async getMahasiswaDetail(mahasiswaId: string): Promise<MahasiswaSIA | null> {
    const { data, error } = await supabaseAdmin
      .from('mahasiswa')
      .select('*')
      .eq('id', mahasiswaId)
      .single();

    if (error || !data) return null;

    // Ambil IPK terakhir dari tabel ipk_per_semester
    const { data: ipkData } = await supabaseAdmin
      .from('ipk_per_semester')
      .select('ipk')
      .eq('mahasiswa_id', mahasiswaId)
      .order('semester', { ascending: false })
      .limit(1)
      .single();

    return {
      id: data.id,
      nrp: data.nrp,
      nama: data.nama,
      angkatan: data.angkatan,
      program_studi: data.program_studi,
      ipk_sekarang: ipkData?.ipk ?? 0,
      status: 'Aktif'
    };
  },

  async getNilai(mahasiswaId: string, semester: number): Promise<NilaiMatkul[]> {
    const { data, error } = await supabaseAdmin
      .from('nilai_mahasiswa')
      .select('*, mata_kuliah(nama_mk, sks)')
      .eq('mahasiswa_id', mahasiswaId)
      .eq('semester', semester);

    if (error || !data) return [];

    return data.map((d: any) => ({
      kode_mk: d.kode_mk,
      nama_mk: d.mata_kuliah?.nama_mk || '-',
      sks: d.mata_kuliah?.sks || 0,
      nilai_angka: d.nilai_angka,
      nilai_huruf: d.nilai_huruf,
      semester: d.semester
    }));
  },

  async getPresensi(mahasiswaId: string): Promise<PresensiMatkul[]> {
    const { data, error } = await supabaseAdmin
      .from('presensi_mahasiswa')
      .select('*, mata_kuliah(nama_mk)')
      .eq('mahasiswa_id', mahasiswaId);

    if (error || !data) return [];

    return data.map((d: any) => ({
      kode_mk: d.kode_mk,
      nama_mk: d.mata_kuliah?.nama_mk || '-',
      total_pertemuan: d.total_pertemuan,
      hadir: d.hadir,
      persentase: d.total_pertemuan > 0 ? (d.hadir / d.total_pertemuan) * 100 : 0
    }));
  },

  async getIpkHistory(mahasiswaId: string): Promise<IpkHistory[]> {
    const { data, error } = await supabaseAdmin
      .from('ipk_per_semester')
      .select('semester, ips, ipk, tahun_akademik')
      .eq('mahasiswa_id', mahasiswaId)
      .order('semester', { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback ke kalkulasi dari tabel nilai jika tidak ada data ipk_per_semester
      return [];
    }

    return data.map((d: any) => ({
      semester: d.semester,
      ips: Number(d.ips),
      ipk: Number(d.ipk),
      tahun_akademik: d.tahun_akademik
    }));
  },

  async getSemesterAntara(dosenWaliId?: string): Promise<SemesterAntaraParticipant[]> {
    let query = supabaseAdmin
      .from('semester_antara')
      .select(`
        id,
        mahasiswa_id,
        tahun_akademik,
        keterangan,
        mahasiswa (nrp, nama),
        semester_antara_matkul (
          kode_mk,
          mata_kuliah (nama_mk, sks)
        )
      `);

    // Jika ada dosenWaliId, filter hanya mahasiswa binaan
    if (dosenWaliId) {
      const { data: binaan } = await supabaseAdmin
        .from('perwalian')
        .select('mahasiswa_id')
        .eq('dosen_wali_id', dosenWaliId)
        .eq('status_aktif', true);

      if (binaan && binaan.length > 0) {
        const mhsIds = binaan.map((b: any) => b.mahasiswa_id);
        query = query.in('mahasiswa_id', mhsIds);
      } else {
        return [];
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((sa: any) => ({
      mahasiswa_id: sa.mahasiswa_id,
      mahasiswa_nama: sa.mahasiswa?.nama || '-',
      mahasiswa_nrp: sa.mahasiswa?.nrp || '-',
      tahun_akademik: sa.tahun_akademik,
      keterangan: sa.keterangan,
      mata_kuliah: (sa.semester_antara_matkul || []).map((sam: any) => ({
        kode_mk: sam.kode_mk,
        nama_mk: sam.mata_kuliah?.nama_mk || '-',
        sks: sam.mata_kuliah?.sks || 0
      }))
    }));
  }
};
