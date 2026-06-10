"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function NilaiTab({ nilai }: { nilai: any[] }) {
  const [selectedSemester, setSelectedSemester] = useState<string>("ALL");

  if (!nilai || nilai.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>Belum ada data nilai.</p>
      </div>
    );
  }

  // Dapatkan daftar semester unik
  const semesters = Array.from(new Set(nilai.map((n) => n.semester))).sort((a, b) => b - a);

  // Filter nilai berdasarkan semester
  const filteredNilai = selectedSemester === "ALL" 
    ? nilai 
    : nilai.filter((n) => n.semester.toString() === selectedSemester);

  // Hitung IPK / IPS (Dummy calculation)
  const totalSks = filteredNilai.reduce((sum, n) => sum + (n.mata_kuliah?.sks || 0), 0);
  const totalBobot = filteredNilai.reduce((sum, n) => {
    let bobot = 0;
    if (n.nilai_huruf === 'A') bobot = 4;
    else if (n.nilai_huruf === 'AB') bobot = 3.5;
    else if (n.nilai_huruf === 'B') bobot = 3;
    else if (n.nilai_huruf === 'BC') bobot = 2.5;
    else if (n.nilai_huruf === 'C') bobot = 2;
    else if (n.nilai_huruf === 'D') bobot = 1;
    return sum + (bobot * (n.mata_kuliah?.sks || 0));
  }, 0);

  const ip = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Hasil Studi (KHS)</h3>
          <p className="text-slate-500">Riwayat nilai mata kuliah yang diambil.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter Semester:</span>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semua Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Semester</SelectItem>
              {semesters.map(sem => (
                <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total SKS Diambil</span>
            <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalSks}</span>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
              {selectedSemester === "ALL" ? "IPK (Kumulatif)" : `IPS Semester ${selectedSemester}`}
            </span>
            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{ip}</span>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-[100px]">Semester</TableHead>
              <TableHead>Kode MK</TableHead>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead className="text-center">SKS</TableHead>
              <TableHead className="text-center">Nilai Angka</TableHead>
              <TableHead className="text-center">Nilai Huruf</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNilai.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-slate-600 dark:text-slate-400">Smst {item.semester}</TableCell>
                <TableCell>{item.kode_mk}</TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{item.mata_kuliah?.nama_mk}</TableCell>
                <TableCell className="text-center">{item.mata_kuliah?.sks}</TableCell>
                <TableCell className="text-center">{item.nilai_angka}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.nilai_huruf === 'A' || item.nilai_huruf === 'AB' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    item.nilai_huruf === 'B' || item.nilai_huruf === 'BC' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    item.nilai_huruf === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.nilai_huruf}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
