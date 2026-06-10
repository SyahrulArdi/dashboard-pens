"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockBermasalah = [
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c12', nrp: '3120600002', nama: 'Budi Gunawan', ipk: 2.30, masalah: 'IPK Turun / Nilai Rendah', status_tindak_lanjut: 'Belum' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c14', nrp: '3120600004', nama: 'Deni Setiawan', ipk: 3.10, masalah: 'Kehadiran Buruk', status_tindak_lanjut: 'Belum' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15', nrp: '3120600005', nama: 'Eka Putri', ipk: 2.80, masalah: 'IPK Turun', status_tindak_lanjut: 'Sudah' },
];

export default function MahasiswaBermasalahPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMasalah, setFilterMasalah] = useState("all");

  const filteredData = mockBermasalah.filter(m => {
    const matchName = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.nrp.includes(searchTerm);
    const matchMasalah = filterMasalah === "all" || m.masalah.includes(filterMasalah);
    return matchName && matchMasalah;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-red-800 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Pantau Mahasiswa Bermasalah
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Daftar mahasiswa yang memerlukan perhatian khusus karena kondisi akademik kritis.</p>
      </div>

      <Card className="border-red-200 dark:border-red-900 shadow-sm">
        <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-red-800 dark:text-red-400">Tabel Evaluasi</CardTitle>
              <CardDescription>Menampilkan {filteredData.length} mahasiswa bermasalah.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="pl-9 bg-white dark:bg-slate-950"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterMasalah} onValueChange={setFilterMasalah}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Jenis Masalah" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Masalah</SelectItem>
                  <SelectItem value="IPK Turun">IPK Turun</SelectItem>
                  <SelectItem value="Nilai Rendah">Nilai Rendah</SelectItem>
                  <SelectItem value="Kehadiran Buruk">Kehadiran Buruk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">NRP</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>IPK</TableHead>
                <TableHead>Jenis Masalah</TableHead>
                <TableHead>Tindak Lanjut</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Bagus! Tidak ada mahasiswa bermasalah dengan kriteria ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((mhs) => (
                  <TableRow key={mhs.id}>
                    <TableCell className="font-medium">{mhs.nrp}</TableCell>
                    <TableCell>{mhs.nama}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-red-600">
                        {mhs.ipk.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 border-none">
                        {mhs.masalah}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {mhs.status_tindak_lanjut === 'Sudah' ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">Sudah (Selesai)</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">Perlu Tindakan</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dosenwali/mahasiswa/${mhs.id}`}>Detail</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
