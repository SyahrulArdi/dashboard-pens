import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getSkemMahasiswaBinaan } from "../actions";
import SKEMClient from "./SKEMClient";

export const dynamic = "force-dynamic";

export default async function SKEMPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const dosenId = userId;
  const skemData = await getSkemMahasiswaBinaan(dosenId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pemantauan SKEM</h1>
          <p className="text-slate-500 dark:text-slate-400">Pantau capaian non-akademik (Satuan Kredit Ekstrakurikuler Mahasiswa) binaan Anda.</p>
        </div>
      </div>
      <SKEMClient data={skemData} />
    </div>
  );
}
