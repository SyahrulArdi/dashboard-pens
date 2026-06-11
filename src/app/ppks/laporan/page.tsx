import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLaporanPPKS } from "../actions";
import PPKSClient from "./PPKSClient";

export const dynamic = "force-dynamic";

export default async function PPKSDashboard() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ppks") {
    redirect("/login");
  }

  const laporanAll = await getLaporanPPKS();
  const laporan = laporanAll.filter(l => l.status !== "SELESAI");

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Laporan Masuk PPKS
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Tinjau dan tindak lanjuti laporan mahasiswa bermasalah yang dirujuk oleh Dosen Wali.
        </p>
      </div>
      <PPKSClient data={laporan} />
    </div>
  );
}
