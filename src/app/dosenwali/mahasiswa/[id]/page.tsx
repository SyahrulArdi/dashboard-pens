import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDetailMahasiswaLengkap } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, GraduationCap, CalendarDays, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MahasiswaDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "dosen_wali") redirect("/login");

  let detail: any;
  try {
    detail = await getDetailMahasiswaLengkap(params.id, userId);
  } catch (error) {
    return (
      <div className="text-center py-20 text-slate-500">
        Mahasiswa tidak ditemukan atau bukan binaan Anda.
      </div>
    );
  }

  const { profil, nilai, presensi, ipkHistory, skem } = detail;

  // Kalkulasi IPK terkini (bisa dari ipkHistory terakhir)
  const ipkSekarang = ipkHistory.length > 0 ? ipkHistory[ipkHistory.length - 1].ipk : 0;
  
  // Kalkulasi persentase kehadiran total
  const totalHadir = presensi.reduce((acc: number, p: any) => acc + p.hadir, 0);
  const totalPertemuan = presensi.reduce((acc: number, p: any) => acc + p.total_pertemuan, 0);
  const persentaseKehadiran = totalPertemuan > 0 ? Math.round((totalHadir / totalPertemuan) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/dosenwali/mahasiswa" className="hover:text-indigo-600">Daftar Binaan</Link>
            <span>/</span>
            <span>Detail Mahasiswa</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User className="h-6 w-6 text-indigo-600" />
            Profil Akademik Mahasiswa
          </h1>
        </div>
        <Button asChild variant="outline" className="glass-card">
          <Link href="/dosenwali/psikologi">Lihat Hasil Psikologi</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Info Card Utama */}
        <Card className="md:col-span-1 glass-panel border-none shadow-sm h-fit">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {profil.nama.charAt(0)}
                </span>
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-xl">{profil.nama}</CardTitle>
              <CardDescription className="font-mono mt-1 text-slate-500">{profil.nrp}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Email</p>
              <p className="font-medium">{profil.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Program Studi</p>
              <p className="font-medium">{profil.program_studi}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Angkatan</p>
              <p className="font-medium">{profil.angkatan}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">IPK Saat Ini</p>
                <p className={`text-xl font-bold ${ipkSekarang < 2.5 ? "text-red-600" : "text-indigo-700"}`}>
                  {ipkSekarang.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">Kehadiran</p>
                <p className={`text-xl font-bold ${persentaseKehadiran < 75 ? "text-red-600" : "text-emerald-700"}`}>
                  {persentaseKehadiran}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Detail Info */}
        <div className="md:col-span-2">
          <Tabs defaultValue="nilai" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-6">
              <TabsTrigger value="nilai" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-6 font-semibold">
                <GraduationCap className="h-4 w-4 mr-2" /> Nilai per Semester
              </TabsTrigger>
              <TabsTrigger value="presensi" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-6 font-semibold">
                <CalendarDays className="h-4 w-4 mr-2" /> Rekap Presensi
              </TabsTrigger>
              <TabsTrigger value="skem" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-6 font-semibold">
                <Activity className="h-4 w-4 mr-2" /> Capaian SKEM
              </TabsTrigger>
            </TabsList>

            {/* TAB NILAI */}
            <TabsContent value="nilai" className="space-y-6">
              {ipkHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">Belum ada riwayat nilai semester.</div>
              ) : (
                ipkHistory.map((history: any) => {
                  const nilaiSemester = nilai.filter((n: any) => n.semester === history.semester);
                  return (
                    <Card key={history.semester} className="glass-panel border-none shadow-sm">
                      <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Semester {history.semester}</CardTitle>
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium text-slate-600">IPS: <span className="font-bold text-indigo-600">{Number(history.ips).toFixed(2)}</span></span>
                            <span className="font-medium text-slate-600">IPK: <span className="font-bold text-indigo-600">{Number(history.ipk).toFixed(2)}</span></span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode</TableHead>
                              <TableHead>Mata Kuliah</TableHead>
                              <TableHead className="text-center">SKS</TableHead>
                              <TableHead className="text-center">Nilai Angka</TableHead>
                              <TableHead className="text-center">Nilai Huruf</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {nilaiSemester.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-slate-500">Tidak ada data mata kuliah.</TableCell>
                              </TableRow>
                            ) : (
                              nilaiSemester.map((n: any) => (
                                <TableRow key={n.id}>
                                  <TableCell className="font-mono text-slate-500">{n.kode_mk}</TableCell>
                                  <TableCell className="font-medium">{n.mata_kuliah?.nama_mk}</TableCell>
                                  <TableCell className="text-center">{n.mata_kuliah?.sks}</TableCell>
                                  <TableCell className="text-center">{Number(n.nilai_angka).toFixed(2)}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant={n.nilai_huruf === 'D' || n.nilai_huruf === 'E' ? 'destructive' : 'secondary'} className="w-8 justify-center">
                                      {n.nilai_huruf}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                }).reverse() // Tampilkan semester terbaru di atas
              )}
            </TabsContent>

            {/* TAB PRESENSI */}
            <TabsContent value="presensi" className="space-y-4">
              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Rekap Kehadiran Mata Kuliah</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Semester</TableHead>
                        <TableHead>Mata Kuliah</TableHead>
                        <TableHead className="text-center">Hadir</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-right">Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presensi.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada data presensi.</TableCell>
                        </TableRow>
                      ) : (
                        presensi.map((p: any) => {
                          const pct = p.total_pertemuan > 0 ? Math.round((p.hadir / p.total_pertemuan) * 100) : 0;
                          return (
                            <TableRow key={p.id}>
                              <TableCell>{p.semester}</TableCell>
                              <TableCell className="font-medium">{p.mata_kuliah?.nama_mk}</TableCell>
                              <TableCell className="text-center">{p.hadir}</TableCell>
                              <TableCell className="text-center">{p.total_pertemuan}</TableCell>
                              <TableCell className="text-right">
                                <span className={`font-bold ${pct < 75 ? "text-red-600" : "text-emerald-600"}`}>{pct}%</span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB SKEM */}
            <TabsContent value="skem" className="space-y-4">
              <Card className="glass-panel border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Satuan Kredit Ekstrakurikuler Mahasiswa (SKEM)</CardTitle>
                  <CardDescription>Capaian kegiatan non-akademik mahasiswa.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Nama Kegiatan</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-center">Poin</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skem.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada kegiatan SKEM yang diajukan.</TableCell>
                        </TableRow>
                      ) : (
                        skem.map((s: any) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.kategori}</TableCell>
                            <TableCell>{s.nama_kegiatan}</TableCell>
                            <TableCell>{new Date(s.tanggal_kegiatan).toLocaleDateString("id-ID")}</TableCell>
                            <TableCell className="text-center font-bold text-indigo-600">{s.poin}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={s.status === 'DIVALIDASI' ? 'default' : 'outline'}>{s.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
