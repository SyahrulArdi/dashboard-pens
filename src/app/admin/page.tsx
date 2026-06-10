import { getMahasiswa, getDosenWali, getPPKS, getMataKuliah, getJadwalKuliah } from "./actions";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [mahasiswa, dosen, ppks, matkul, jadwal] = await Promise.all([
    getMahasiswa(),
    getDosenWali(),
    getPPKS(),
    getMataKuliah(),
    getJadwalKuliah(),
  ]);

  return (
    <AdminDashboardClient 
      mahasiswa={mahasiswa}
      dosen={dosen}
      ppks={ppks}
      matkul={matkul}
      jadwal={jadwal}
    />
  );
}
