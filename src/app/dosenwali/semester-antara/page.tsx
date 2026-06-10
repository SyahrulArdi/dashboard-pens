"use client";

import { useQuery } from "@tanstack/react-query";
import { siaClient } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SemesterAntaraPage() {
  const { data: semAntara, isLoading: loadingSem } = useQuery({
    queryKey: ['semester-antara'],
    queryFn: () => siaClient.getSemesterAntara()
  });

  const { data: mhsDetails, isLoading: loadingMhs } = useQuery({
    queryKey: ['mahasiswa-all'],
    queryFn: async () => {
      // Mocking fetch all mahasiswa info for display
      const m1 = await siaClient.getMahasiswaDetail('a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15');
      return m1 ? [m1] : [];
    },
    enabled: !!semAntara
  });

  const isLoading = loadingSem || loadingMhs;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Informasi Semester Antara
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Daftar mahasiswa binaan yang sedang menempuh perbaikan nilai pada semester antara (pendek).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peserta Semester Antara</CardTitle>
          <CardDescription>Menampilkan {semAntara?.length || 0} mahasiswa yang terdaftar pada program semester antara periode ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NRP</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Mata Kuliah Diambil</TableHead>
                <TableHead>Total SKS</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Memuat data...</TableCell>
                </TableRow>
              ) : semAntara?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">Tidak ada mahasiswa yang menempuh semester antara.</TableCell>
                </TableRow>
              ) : (
                semAntara?.map((sa) => {
                  const mhsInfo = mhsDetails?.find(m => m.id === sa.mahasiswa_id);
                  const totalSks = sa.mata_kuliah.reduce((acc, curr) => acc + curr.sks, 0);
                  
                  return (
                    <TableRow key={sa.mahasiswa_id}>
                      <TableCell className="font-medium">{mhsInfo?.nrp || '-'}</TableCell>
                      <TableCell>{mhsInfo?.nama || 'Memuat...'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sa.mata_kuliah.map(mk => (
                            <Badge key={mk.kode_mk} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {mk.nama_mk}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{totalSks} SKS</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dosenwali/mahasiswa/${sa.mahasiswa_id}`}>Detail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
