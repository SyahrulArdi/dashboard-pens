import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getLaporanPPKS } from "./actions";
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PPKSDashboardPage() {
  const session = await getServerSession(authOptions);
  // Ambil semua data laporan
  const laporan = await getLaporanPPKS();

  // Hitung statistik
  const totalLaporan = laporan.length;
  const menunggu = laporan.filter(l => l.status === "DITERIMA").length;
  const diproses = laporan.filter(l => l.status === "DIPROSES").length;
  const selesai = laporan.filter(l => l.status === "SELESAI").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Selamat Datang, Tim PPKS
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Pantau dan kelola laporan masalah mahasiswa dengan sigap.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-100 dark:border-red-900/30 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Laporan
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalLaporan}</div>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Total kasus tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 dark:border-amber-900/30 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Menunggu Tindakan
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{menunggu}</div>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Status: DITERIMA</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 dark:border-blue-900/30 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Sedang Diproses
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{diproses}</div>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Status: DIPROSES</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 dark:border-emerald-900/30 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Selesai Ditangani
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{selesai}</div>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Status: SELESAI</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Ringkasan Informasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p>
                Sebagai Satgas Pencegahan dan Penanganan Kekerasan Seksual (PPKS) sekaligus pusat penanganan masalah mahasiswa, peran Anda sangat krusial dalam menjaga lingkungan akademik yang sehat, aman, dan kondusif.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Anda akan menerima rujukan pelaporan dari Dosen Wali terkait kondisi mahasiswa.</li>
                <li>Gunakan menu <strong>Laporan Masuk</strong> untuk menindaklanjuti laporan baru (status: DITERIMA).</li>
                <li>Setelah tindakan dilakukan, Anda dapat mengubah statusnya menjadi <strong>DIPROSES</strong> atau <strong>SELESAI</strong> dan memberikan catatan penanganan.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
