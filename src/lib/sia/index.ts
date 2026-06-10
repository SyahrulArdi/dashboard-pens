import { supabase } from "../supabase";

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
};

export type SemesterAntaraParticipant = {
  mahasiswa_id: string;
  mata_kuliah: { kode_mk: string; nama_mk: string; sks: number }[];
};

export const siaClient = {
  async getMahasiswaDetail(mahasiswaId: string): Promise<MahasiswaSIA | null> {
    const { data, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('id', mahasiswaId)
      .single();

    if (error || !data) return null;

    // Untuk demo, asumsikan IPK sekarang dihitung dari history (di sini mock sementara untuk properti yang tidak ada di DB langsung)
    return {
      id: data.id,
      nrp: data.nrp,
      nama: data.nama,
      angkatan: data.angkatan,
      program_studi: data.program_studi,
      ipk_sekarang: 3.5, // TODO: Hitung dari tabel nilai
      status: 'Aktif'
    };
  },

  async getNilai(mahasiswaId: string, semester: number): Promise<NilaiMatkul[]> {
    const { data, error } = await supabase
      .from('nilai_mahasiswa')
      .select('*, mata_kuliah(nama_mk, sks)')
      .eq('mahasiswa_id', mahasiswaId)
      .eq('semester', semester);

    if (error || !data) return [];

    return data.map((d: { kode_mk: string; mata_kuliah: { nama_mk: string; sks: number }; nilai_angka: number; nilai_huruf: string; semester: number; }) => ({
      kode_mk: d.kode_mk,
      nama_mk: d.mata_kuliah?.nama_mk || '-',
      sks: d.mata_kuliah?.sks || 0,
      nilai_angka: d.nilai_angka,
      nilai_huruf: d.nilai_huruf,
      semester: d.semester
    }));
  },

  async getPresensi(mahasiswaId: string): Promise<PresensiMatkul[]> {
    const { data, error } = await supabase
      .from('presensi_mahasiswa')
      .select('*, mata_kuliah(nama_mk)')
      .eq('mahasiswa_id', mahasiswaId);

    if (error || !data) return [];

    return data.map((d: { kode_mk: string; mata_kuliah: { nama_mk: string }; total_pertemuan: number; hadir: number; }) => ({
      kode_mk: d.kode_mk,
      nama_mk: d.mata_kuliah?.nama_mk || '-',
      total_pertemuan: d.total_pertemuan,
      hadir: d.hadir,
      persentase: (d.hadir / d.total_pertemuan) * 100
    }));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIpkHistory(_mahasiswaId: string): Promise<IpkHistory[]> {
    // Sebagai kerangka dinamis. Untuk sekarang mengembalikan data fallback agar tidak crash.
    return [
      { semester: 1, ips: 3.5, ipk: 3.5 },
      { semester: 2, ips: 3.6, ipk: 3.55 },
      { semester: 3, ips: 3.8, ipk: 3.63 },
    ];
  },

  async getSemesterAntara(): Promise<SemesterAntaraParticipant[]> {
    return [];
  }
};
