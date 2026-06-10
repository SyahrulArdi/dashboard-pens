"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PPKSDashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Laporan PPKS</h2>
        <p className="text-slate-500">Tinjau laporan mahasiswa yang dirujuk oleh Dosen Wali.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fitur Segera Datang</CardTitle>
        </CardHeader>
        <CardContent>
          Halaman ini akan menampilkan daftar laporan masuk dan formulir penanganan mahasiswa bermasalah.
        </CardContent>
      </Card>
    </div>
  );
}
