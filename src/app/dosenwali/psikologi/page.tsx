import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getMahasiswaBinaan } from "../actions";
import PsikologiClient from "./PsikologiClient";

export const dynamic = "force-dynamic";

export default async function PsikologiPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const dosenId = userId;
  const mahasiswa = await getMahasiswaBinaan(dosenId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Hasil Tes Psikologi</h1>
          <p className="text-slate-500 dark:text-slate-400">Integrasi profil psikologis mahasiswa dari sistem layanan tes psikologi PENS.</p>
        </div>
      </div>
      <PsikologiClient mahasiswa={mahasiswa} />
    </div>
  );
}
