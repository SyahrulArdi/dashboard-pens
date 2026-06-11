import { getJadwalKuliah, getMataKuliah, getDosenWali } from "../actions";
import JadwalTab from "../_components/JadwalTab";

export const dynamic = "force-dynamic";

export default async function AdminJadwalPage() {
  const [jadwal, matkul, dosen] = await Promise.all([
    getJadwalKuliah(),
    getMataKuliah(),
    getDosenWali(),
  ]);

  return <JadwalTab initialData={jadwal} mataKuliahOptions={matkul} dosenOptions={dosen} />;
}
