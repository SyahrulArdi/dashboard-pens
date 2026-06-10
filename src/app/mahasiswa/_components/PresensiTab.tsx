"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function PresensiTab({ presensi }: { presensi: any[] }) {
  if (!presensi || presensi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>Belum ada data presensi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Kehadiran (Presensi)</h3>
          <p className="text-slate-500">Persentase kehadiran per mata kuliah.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-[100px]">Semester</TableHead>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead className="text-center">Hadir / Total</TableHead>
              <TableHead className="w-[200px]">Persentase</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presensi.map((item, idx) => {
              const persentase = item.total_pertemuan > 0 
                ? Math.round((item.hadir / item.total_pertemuan) * 100) 
                : 0;
              
              let statusColor = "bg-emerald-500";
              let statusText = "Aman";
              if (persentase < 70) {
                statusColor = "bg-red-500";
                statusText = "Bahaya";
              } else if (persentase < 80) {
                statusColor = "bg-yellow-500";
                statusText = "Waspada";
              }

              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-slate-600 dark:text-slate-400">Smst {item.semester}</TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">{item.mata_kuliah?.nama_mk}</TableCell>
                  <TableCell className="text-center">{item.hadir} / {item.total_pertemuan}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={persentase} className="h-2 flex-1" indicatorClassName={statusColor} />
                      <span className="text-sm font-medium w-9">{persentase}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      statusText === 'Aman' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      statusText === 'Waspada' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {statusText}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
