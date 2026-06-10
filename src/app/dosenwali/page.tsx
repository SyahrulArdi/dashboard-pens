import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getMahasiswaBinaan, getNotifikasiDosen, getPengajuanKRSBinaan } from "./actions";
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

  // Fetch all data in parallel
  const [mahasiswaBinaan, notifikasi, pengajuanKRS] = await Promise.all([
    getMahasiswaBinaan(dosenId),
    getNotifikasiDosen(dosenId),
    getPengajuanKRSBinaan(dosenId),
  ]);

  // Calculate summary stats
  const totalBinaan = mahasiswaBinaan.length;
  const bermasalahList = mahasiswaBinaan.filter(
    (m: any) => m.ipk < 2.5 || m.persentase_kehadiran < 75
  );
  const totalBermasalah = bermasalahList.length;
  const totalNotifikasiBaru = notifikasi.filter((n: any) => n.status === "BARU").length;
  const totalKRSPending = pengajuanKRS.filter((k: any) => k.status === "MENUNGGU").length;

  // Calculate trend IPK per semester
  const semesterMap: Record<number, { total: number; count: number }> = {};
  mahasiswaBinaan.forEach((m: any) => {
    const nilais = m.nilai_mahasiswa || [];
    nilais.forEach((n: any) => {
      if (!semesterMap[n.semester]) semesterMap[n.semester] = { total: 0, count: 0 };
      semesterMap[n.semester].total += Number(n.nilai_angka);
      semesterMap[n.semester].count += 1;
    });
  });

  const trendIPK = Object.entries(semesterMap)
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
      totalSemesterAntara={0}
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
