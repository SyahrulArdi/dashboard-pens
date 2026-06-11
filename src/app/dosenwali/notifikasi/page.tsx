import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getNotifikasiDosen } from "../actions";
import NotifikasiClient from "./NotifikasiClient";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") {
    redirect("/login");
  }

  const notifikasi = await getNotifikasiDosen(userId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Kelola Notifikasi
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Peringatan otomatis berdasarkan evaluasi kondisi akademik mahasiswa binaan.
        </p>
      </div>
      <NotifikasiClient data={notifikasi} dosenWaliId={userId} />
    </div>
  );
}
