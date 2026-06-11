import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getMahasiswaBermasalah } from "../actions";
import BermasalahClient from "./BermasalahClient";

export const dynamic = "force-dynamic";

export default async function MahasiswaBermasalahPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const bermasalahData = await getMahasiswaBermasalah(userId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Pantau Mahasiswa Bermasalah
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Daftar mahasiswa binaan yang memerlukan perhatian khusus berdasarkan ambang batas IPK dan kehadiran.
        </p>
      </div>
      <BermasalahClient data={bermasalahData} dosenWaliId={userId} />
    </div>
  );
}
