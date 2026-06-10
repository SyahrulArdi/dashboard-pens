"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MahasiswaDashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Akademik Mahasiswa</h2>
        <p className="text-slate-500">Pantau nilai, kehadiran, dan ajukan KRS.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fitur Segera Datang</CardTitle>
        </CardHeader>
        <CardContent>
          Halaman ini akan menampilkan histori akademik dan form pengajuan persetujuan KRS ke Dosen Wali.
        </CardContent>
      </Card>
    </div>
  );
}
