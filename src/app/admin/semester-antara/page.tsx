import { getAllSemesterAntara, getMahasiswa, getMataKuliah } from "../actions";
import SemesterAntaraClient from "./SemesterAntaraClient";

export const dynamic = "force-dynamic";

export default async function AdminSemesterAntaraPage() {
  const data = await getAllSemesterAntara();
  const mahasiswa = await getMahasiswa();
  const mataKuliah = await getMataKuliah();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Manajemen Semester Antara</h2>
        <p className="text-slate-500 dark:text-slate-400">Kelola pendaftaran mahasiswa untuk semester antara.</p>
      </div>

      <SemesterAntaraClient initialData={data} mahasiswa={mahasiswa} mataKuliah={mataKuliah} />
    </div>
  );
}
