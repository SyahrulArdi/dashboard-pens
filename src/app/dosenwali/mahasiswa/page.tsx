"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MahasiswaSIA } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Fallback manual data untuk list semua mahasiswa jika `siaClient` butuh id spesifik
const mockMahasiswaList: MahasiswaSIA[] = [
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c11', nrp: '3120600001', nama: 'Andi Pratama', angkatan: 2020, program_studi: 'D4 Teknik Informatika', ipk_sekarang: 3.75, status: 'Aktif' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c12', nrp: '3120600002', nama: 'Budi Gunawan', angkatan: 2020, program_studi: 'D4 Teknik Informatika', ipk_sekarang: 2.30, status: 'Aktif' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c13', nrp: '3120600003', nama: 'Citra Lestari', angkatan: 2020, program_studi: 'D4 Teknik Informatika', ipk_sekarang: 3.90, status: 'Aktif' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c14', nrp: '3120600004', nama: 'Deni Setiawan', angkatan: 2020, program_studi: 'D4 Teknik Informatika', ipk_sekarang: 3.10, status: 'Aktif' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15', nrp: '3120600005', nama: 'Eka Putri', angkatan: 2020, program_studi: 'D4 Teknik Informatika', ipk_sekarang: 2.80, status: 'Aktif' },
];

export default function DaftarMahasiswaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof MahasiswaSIA; direction: 'asc' | 'desc' } | null>(null);

  // Dalam produksi, kita panggil route handler yang memanggil DB Perwalian -> ambil NRP -> panggil SIA
  const { data: mahasiswa = mockMahasiswaList, isLoading } = useQuery({
    queryKey: ['mahasiswa-binaan'],
    queryFn: async () => {
      // delay simulasi jaringan
      await new Promise(r => setTimeout(r, 600));
      return mockMahasiswaList;
    }
  });

  const requestSort = (key: keyof MahasiswaSIA) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = mahasiswa.filter(m => 
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.nrp.includes(searchTerm)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Daftar Mahasiswa Binaan</h2>
        <p className="text-slate-500 dark:text-slate-400">Kelola dan pantau seluruh mahasiswa perwalian Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Data Mahasiswa</CardTitle>
              <CardDescription>Total {filteredData.length} mahasiswa ditampilkan.</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Cari nama atau NRP..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" onClick={() => requestSort('nrp')} className="-ml-4 h-8 font-semibold">
                      NRP
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('nama')} className="-ml-4 h-8 font-semibold">
                      Nama Mahasiswa
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Program Studi</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('ipk_sekarang')} className="-ml-4 h-8 font-semibold">
                      IPK
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">Memuat data...</TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">Tidak ada mahasiswa ditemukan.</TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((mhs) => (
                    <TableRow key={mhs.id}>
                      <TableCell className="font-medium">{mhs.nrp}</TableCell>
                      <TableCell>{mhs.nama}</TableCell>
                      <TableCell className="hidden md:table-cell text-slate-500">{mhs.program_studi}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${mhs.ipk_sekarang < 2.5 ? 'text-red-600' : mhs.ipk_sekarang < 3.0 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {mhs.ipk_sekarang.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={mhs.status === 'Aktif' ? 'default' : 'secondary'} className={mhs.status === 'Aktif' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                          {mhs.status}
                        </Badge>
                        {mhs.ipk_sekarang < 2.5 && (
                          <Badge variant="destructive" className="ml-2">Kritis</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dosenwali/mahasiswa/${mhs.id}`}>Lihat Detail Profil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dosenwali/mahasiswa/${mhs.id}/krs`}>Tinjau Nilai / KRS</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
