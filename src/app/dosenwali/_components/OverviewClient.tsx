"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Bell, BookOpen, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface OverviewProps {
  totalBinaan: number;
  totalBermasalah: number;
  totalNotifikasiBaru: number;
  totalSemesterAntara: number;
  totalKRSPending: number;
  trendIPK: { semester: string; ipk_rata_rata: number }[];
  mahasiswaBermasalah: { nama: string; nrp: string; ipk: number; kehadiran: number }[];
}

export default function OverviewClient({
  totalBinaan,
  totalBermasalah,
  totalNotifikasiBaru,
  totalSemesterAntara,
  totalKRSPending,
  trendIPK,
  mahasiswaBermasalah,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Ringkasan kondisi akademik mahasiswa binaan Anda.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mahasiswa Binaan</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBinaan}</div>
            <p className="text-xs text-slate-500">Total mahasiswa aktif</p>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400">Bermasalah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalBermasalah}</div>
            <p className="text-xs text-red-500">IPK &lt; 2.50 / Kehadiran &lt; 75%</p>
          </CardContent>
        </Card>

        <Card className={totalNotifikasiBaru > 0 ? "border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifikasi Baru</CardTitle>
            <Bell className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifikasiBaru}</div>
            <p className="text-xs text-slate-500">Belum ditindaklanjuti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KRS Pending</CardTitle>
            <BookOpen className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKRSPending}</div>
            <p className="text-xs text-slate-500">Menunggu persetujuan Anda</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren IPK Rata-Rata Mahasiswa Binaan</CardTitle>
            <CardDescription>Grafik pergerakan nilai IPK rata-rata dari seluruh mahasiswa binaan Anda.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              {trendIPK.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendIPK} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="semester" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 4.0]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ipk_rata_rata" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="IPK Rata-Rata"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Belum ada data nilai untuk menampilkan grafik.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aksi Cepat & Ringkasan</CardTitle>
            <CardDescription>Akses cepat ke fungsi penting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {totalBermasalah > 0 && (
                <Link href="/dosenwali/bermasalah" className="flex items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Tinjau {totalBermasalah} Mahasiswa Bermasalah</p>
                  </div>
                </Link>
              )}
              {totalKRSPending > 0 && (
                <Link href="/dosenwali/krs" className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">{totalKRSPending} Pengajuan KRS Menunggu</p>
                  </div>
                </Link>
              )}
              {totalNotifikasiBaru > 0 && (
                <Link href="/dosenwali/notifikasi" className="flex items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <Bell className="h-5 w-5 text-yellow-600 mr-3 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">{totalNotifikasiBaru} Notifikasi Belum Dibaca</p>
                  </div>
                </Link>
              )}

              {/* Top bermasalah list */}
              {mahasiswaBermasalah.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Perlu Perhatian</p>
                  {mahasiswaBermasalah.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.nama}</p>
                        <p className="text-xs text-slate-500">{m.nrp}</p>
                      </div>
                      <div className="text-right">
                        {m.ipk < 2.5 && (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <TrendingDown className="w-3 h-3" /> IPK {m.ipk.toFixed(2)}
                          </span>
                        )}
                        {m.kehadiran < 75 && (
                          <span className="text-xs text-orange-600">Hadir {m.kehadiran}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalBermasalah === 0 && totalKRSPending === 0 && totalNotifikasiBaru === 0 && (
                <div className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">Semua mahasiswa binaan dalam kondisi baik!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
