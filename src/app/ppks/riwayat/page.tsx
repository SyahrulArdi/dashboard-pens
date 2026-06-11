import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLaporanPPKS } from "../actions";
import PPKSClient from "../laporan/PPKSClient";

export default async function PPKSRiwayatPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ppks") redirect("/login");

  const data = await getLaporanPPKS();
  // Filter hanya yang sudah selesai
  const riwayatData = data.filter(d => d.status === "SELESAI");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Riwayat Laporan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Daftar laporan mahasiswa yang telah selesai ditangani.
        </p>
      </div>

      <PPKSClient data={riwayatData} />
    </div>
  );
}
