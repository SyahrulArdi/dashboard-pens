import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getMahasiswaBinaan } from "../actions";
import GrafikClient from "./GrafikClient";

export const dynamic = "force-dynamic";

export default async function GrafikPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  // Ambil daftar mahasiswa binaan real dari DB
  const mahasiswaBinaan = await getMahasiswaBinaan(userId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Grafik Akademik
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Analisis visual tren IPK dan distribusi nilai per mahasiswa binaan.
        </p>
      </div>
      <GrafikClient mahasiswaList={mahasiswaBinaan} />
    </div>
  );
}
