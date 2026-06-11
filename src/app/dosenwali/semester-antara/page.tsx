import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getSemesterAntaraBinaan } from "../actions";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SemesterAntaraPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") redirect("/login");

  const semAntara = await getSemesterAntaraBinaan(userId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Informasi Semester Antara
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Daftar mahasiswa binaan yang sedang menempuh program perbaikan nilai pada semester antara.
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="glass-panel border-none shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{semAntara.length}</p>
                <p className="text-xs text-slate-500">Peserta Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-none shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {semAntara.reduce((acc: number, sa: any) => acc + (sa.semester_antara_matkul?.length ?? 0), 0)}
                </p>
                <p className="text-xs text-slate-500">Total MK Diperbaiki</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Peserta Semester Antara</CardTitle>
          <CardDescription>
            {semAntara.length > 0
              ? `${semAntara.length} mahasiswa binaan terdaftar pada program semester antara.`
              : "Tidak ada mahasiswa binaan yang menempuh semester antara saat ini."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NRP</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Tahun Akademik</TableHead>
                <TableHead>Mata Kuliah Diperbaiki</TableHead>
                <TableHead>Total SKS</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semAntara.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Tidak ada mahasiswa yang sedang menempuh semester antara.
                  </TableCell>
                </TableRow>
              ) : (
                semAntara.map((sa: any) => {
                  const totalSks = (sa.semester_antara_matkul || []).reduce(
                    (acc: number, sam: any) => acc + (sam.mata_kuliah?.sks ?? 0),
                    0
                  );
                  return (
                    <TableRow key={sa.id}>
                      <TableCell className="font-mono font-medium">{sa.mahasiswa?.nrp}</TableCell>
                      <TableCell className="font-medium">{sa.mahasiswa?.nama}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {sa.tahun_akademik}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(sa.semester_antara_matkul || []).map((sam: any) => (
                            <Badge
                              key={sam.kode_mk}
                              variant="outline"
                              className="text-xs"
                            >
                              {sam.mata_kuliah?.nama_mk ?? sam.kode_mk}
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
