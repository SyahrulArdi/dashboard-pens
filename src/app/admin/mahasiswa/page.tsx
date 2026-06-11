import { getMahasiswa } from "../actions";
import MahasiswaTab from "../_components/MahasiswaTab";

export const dynamic = "force-dynamic";

export default async function AdminMahasiswaPage() {
  const mahasiswa = await getMahasiswa();

  return <MahasiswaTab initialData={mahasiswa} />;
}
