"use client";

import { useQuery } from "@tanstack/react-query";
import { siaClient } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MahasiswaDetailPage({ params }: { params: { id: string } }) {
  const { data: mhs, isLoading: loadingMhs } = useQuery({
    queryKey: ['mahasiswa', params.id],
    queryFn: () => siaClient.getMahasiswaDetail(params.id)
  });

  const { data: ipkHistory, isLoading: loadingIpk } = useQuery({
    queryKey: ['ipk', params.id],
    queryFn: () => siaClient.getIpkHistory(params.id)
  });

  const { data: nilai, isLoading: loadingNilai } = useQuery({
    queryKey: ['nilai', params.id, 3], // mock semester 3
    queryFn: () => siaClient.getNilai(params.id, 3)
  });

  const { data: presensi, isLoading: loadingPresensi } = useQuery({
    queryKey: ['presensi', params.id],
    queryFn: () => siaClient.getPresensi(params.id)
  });

  if (loadingMhs) return <div className="p-8 text-center text-slate-500">Memuat profil mahasiswa...</div>;
  if (!mhs) return <div className="p-8 text-center text-red-500">Mahasiswa tidak ditemukan</div>;

  // Transform data for bar chart
  const distribusiNilai = [
    { huruf: 'A', jumlah: nilai?.filter(n => n.nilai_huruf === 'A').length || 0 },
    { huruf: 'AB', jumlah: nilai?.filter(n => n.nilai_huruf === 'AB').length || 0 },
    { huruf: 'B', jumlah: nilai?.filter(n => n.nilai_huruf === 'B').length || 0 },
    { huruf: 'BC', jumlah: nilai?.filter(n => n.nilai_huruf === 'BC').length || 0 },
    { huruf: 'C', jumlah: nilai?.filter(n => n.nilai_huruf === 'C').length || 0 },
    { huruf: 'D', jumlah: nilai?.filter(n => n.nilai_huruf === 'D').length || 0 },
    { huruf: 'E', jumlah: nilai?.filter(n => n.nilai_huruf === 'E').length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dosenwali/mahasiswa"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profil Mahasiswa</h2>
          <p className="text-slate-500 dark:text-slate-400">Detail akademik untuk {mhs.nama} ({mhs.nrp}).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Profil Card */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12" />
            </div>
            <CardTitle className="text-xl">{mhs.nama}</CardTitle>
            <CardDescription className="text-base">{mhs.nrp}</CardDescription>
            <div className="mt-2">
              <Badge variant={mhs.status === 'Aktif' ? 'default' : 'secondary'} className={mhs.status === 'Aktif' ? 'bg-green-100 text-green-800' : ''}>
                {mhs.status}
              </Badge>
              {mhs.ipk_sekarang < 2.5 && (
                <Badge variant="destructive" className="ml-2">Kritis</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Angkatan</span>
                <span className="font-medium">{mhs.angkatan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Studi</span>
                <span className="font-medium text-right">{mhs.program_studi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IPK Terkini</span>
                <span className={`font-bold ${mhs.ipk_sekarang < 2.5 ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'}`}>
                  {mhs.ipk_sekarang.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" asChild>
                <Link href={`/dosenwali/mahasiswa/${mhs.id}/krs`}>Tinjau Nilai / KRS</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Tabs Konten */}
        <div className="md:col-span-2">
          <Tabs defaultValue="grafik" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grafik">Grafik & IPK</TabsTrigger>
              <TabsTrigger value="presensi">Presensi</TabsTrigger>
              <TabsTrigger value="semester_antara">Semester Antara</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grafik" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tren IPK per Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    {loadingIpk ? (
                      <div className="h-full flex items-center justify-center text-slate-500">Memuat grafik...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ipkHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="semester" tickFormatter={(v) => `Smt ${v}`} />
                          <YAxis domain={[0, 4]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="ipk" stroke="#2563eb" name="IPK Kumulatif" strokeWidth={3} />
                          <Line type="monotone" dataKey="ips" stroke="#16a34a" name="IPS (Semester)" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Nilai (Semester Berjalan)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    {loadingNilai ? (
                      <div className="h-full flex items-center justify-center text-slate-500">Memuat grafik...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distribusiNilai} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="huruf" />
                          <YAxis allowDecimals={false} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="jumlah" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Jumlah Mata Kuliah" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="presensi" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rekap Kehadiran</CardTitle>
                  <CardDescription>Persentase kehadiran per mata kuliah semester ini.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPresensi ? (
                    <div className="text-center text-slate-500 p-4">Memuat data presensi...</div>
                  ) : (
                    <div className="space-y-6">
                      {presensi?.map((p, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{p.nama_mk} ({p.kode_mk})</span>
                            <span className={p.persentase < 75 ? 'text-red-600 font-bold' : ''}>
                              {p.hadir}/{p.total_pertemuan} ({p.persentase}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${p.persentase < 75 ? 'bg-red-500' : p.persentase < 85 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                              style={{ width: `${p.persentase}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="semester_antara" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Semester Antara</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    {params.id === 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15' ? (
                      <>
                        <BookOpen className="h-12 w-12 text-blue-500 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sedang Menempuh Semester Antara</h3>
                        <p className="text-slate-500 max-w-sm mt-2 mb-4">Mahasiswa ini mengambil 1 mata kuliah perbaikan pada semester antara.</p>
                        <Badge variant="outline" className="text-blue-600 bg-blue-50">Struktur Data (IF102) - 3 SKS</Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tidak Ada Data</h3>
                        <p className="text-slate-500 max-w-sm mt-2">Mahasiswa ini tidak mendaftar pada semester antara berjalan.</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
