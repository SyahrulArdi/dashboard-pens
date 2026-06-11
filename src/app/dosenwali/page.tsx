import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  getMahasiswaBinaan,
  getNotifikasiDosen,
  getPengajuanKRSBinaan,
  getSemesterAntaraBinaan,
} from "./actions";
import OverviewClient from "./_components/OverviewClient";

export const dynamic = "force-dynamic";

export default async function DosenWaliDashboard() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const dosenId = userId;

  const [mahasiswaBinaan, notifikasi, pengajuanKRS, semesterAntara] = await Promise.all([
    getMahasiswaBinaan(dosenId),
    getNotifikasiDosen(dosenId),
    getPengajuanKRSBinaan(dosenId),
    getSemesterAntaraBinaan(dosenId),
  ]);

  const totalBinaan = mahasiswaBinaan.length;
  const bermasalahList = mahasiswaBinaan.filter(
    (m: any) => m.ipk < 2.5 || m.persentase_kehadiran < 75
  );
  const totalBermasalah = bermasalahList.length;
  const totalNotifikasiBaru = notifikasi.filter((n: any) => n.status === "BARU").length;
  const totalKRSPending = pengajuanKRS.filter((k: any) => k.status === "MENUNGGU").length;
  const totalSemesterAntara = semesterAntara.length;

  // Build IPK trend dari data ipk_per_semester yang real
  // Rata-rata IPK semua mahasiswa binaan per semester
  const semesterIPKMap: Record<number, { total: number; count: number }> = {};
  
  // Kita perlu ambil ipk_per_semester untuk semua mahasiswa binaan
  // Data IPK sudah dihitung di getMahasiswaBinaan, tapi kita butuh history
  // Gunakan bermasalahList sebagai data untuk trend keseluruhan
  mahasiswaBinaan.forEach((m: any) => {
    const sem = m.semester_terbaru;
    if (sem > 0) {
      if (!semesterIPKMap[sem]) semesterIPKMap[sem] = { total: 0, count: 0 };
      semesterIPKMap[sem].total += m.ipk;
      semesterIPKMap[sem].count += 1;
    }
  });

  const trendIPK = Object.entries(semesterIPKMap)
    .map(([sem, val]) => ({
      semester: `Semester ${sem}`,
      ipk_rata_rata: Number((val.total / val.count).toFixed(2)),
    }))
    .sort((a, b) => parseInt(a.semester.split(" ")[1]) - parseInt(b.semester.split(" ")[1]));

  return (
    <OverviewClient
      totalBinaan={totalBinaan}
      totalBermasalah={totalBermasalah}
      totalNotifikasiBaru={totalNotifikasiBaru}
      totalSemesterAntara={totalSemesterAntara}
      totalKRSPending={totalKRSPending}
      trendIPK={trendIPK}
      mahasiswaBermasalah={bermasalahList.map((m: any) => ({
        nama: m.nama,
        nrp: m.nrp,
        ipk: m.ipk,
        kehadiran: m.persentase_kehadiran,
      }))}
    />
  );
}
