import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPengajuanKRSBinaan } from "../actions";
import KRSClient from "./KRSClient";

export const dynamic = "force-dynamic";

export default async function KRSPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const dosenId = userId;
  const pengajuanKRS = await getPengajuanKRSBinaan(dosenId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Persetujuan KRS</h1>
          <p className="text-slate-500 dark:text-slate-400">Tinjau nilai semester sebelumnya dan setujui Kartu Rencana Studi mahasiswa binaan Anda.</p>
        </div>
      </div>
      <KRSClient initialData={pengajuanKRS} />
    </div>
  );
}
