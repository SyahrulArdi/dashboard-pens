"use client";

import { useQuery } from "@tanstack/react-query";
import { siaClient } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function KrsApprovalPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const { data: mhs, isLoading: loadingMhs } = useQuery({
    queryKey: ['mahasiswa', params.id],
    queryFn: () => siaClient.getMahasiswaDetail(params.id)
  });

  const { data: nilai, isLoading: loadingNilai } = useQuery({
    queryKey: ['nilai', params.id, 3], 
    queryFn: () => siaClient.getNilai(params.id, 3)
  });

  const handleApprove = () => {
    setStatus('approved');
    toast({
      title: "KRS Disetujui",
      description: "Anda telah menyetujui pengajuan KRS mahasiswa ini.",
    });
  };

  const handleReject = () => {
    setStatus('rejected');
    toast({
      variant: "destructive",
      title: "KRS Ditolak",
      description: "Anda telah menolak pengajuan KRS mahasiswa ini.",
    });
  };

  if (loadingMhs) return <div className="p-8 text-center">Memuat data...</div>;
  if (!mhs) return <div className="p-8 text-center text-red-500">Mahasiswa tidak ditemukan</div>;

  const totalSksLulus = nilai?.reduce((acc, curr) => curr.nilai_huruf !== 'E' ? acc + curr.sks : acc, 0) || 0;
  const isKritis = mhs.ipk_sekarang < 2.5;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dosenwali/mahasiswa/${params.id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Persetujuan KRS</h2>
          <p className="text-slate-500">Evaluasi nilai semester sebelumnya sebelum menyetujui KRS.</p>
        </div>
      </div>

      {isKritis && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded-md flex gap-3">
          <Info className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-400">Peringatan: Mahasiswa Kritis</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              IPK mahasiswa ini berada di bawah batas wajar (2.50). Harap pastikan pengambilan SKS pada semester depan tidak melebihi batas yang disarankan untuk mencegah DO. Disarankan maksimal 18 SKS.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Nilai Semester Sebelumnya</CardTitle>
              <CardDescription>Menampilkan nilai dari semester berjalan yang baru saja diselesaikan.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingNilai ? (
                <div className="text-center text-slate-500 p-4">Memuat data nilai...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode MK</TableHead>
                      <TableHead>Mata Kuliah</TableHead>
                      <TableHead>SKS</TableHead>
                      <TableHead>Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nilai?.map((n, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{n.kode_mk}</TableCell>
                        <TableCell>{n.nama_mk}</TableCell>
                        <TableCell>{n.sks}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${['D', 'E'].includes(n.nilai_huruf) ? 'text-red-600' : ''}`}>
                            {n.nilai_huruf}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Total SKS Lulus</span>
                <span className="font-medium">{totalSksLulus} SKS</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">SKS Maksimal</span>
                <span className="font-medium">{isKritis ? '18 SKS' : '24 SKS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status KRS</span>
                {status === 'pending' && <Badge variant="outline" className="text-orange-600 border-orange-600">Menunggu</Badge>}
                {status === 'approved' && <Badge variant="default" className="bg-green-600">Disetujui</Badge>}
                {status === 'rejected' && <Badge variant="destructive">Ditolak</Badge>}
              </div>
            </CardContent>
            {status === 'pending' && (
              <CardFooter className="flex flex-col gap-2 pt-2 border-t">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" /> Setujui Pengajuan KRS
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 border-red-200" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" /> Tolak & Minta Perbaikan
                </Button>
              </CardFooter>
            )}
            {status !== 'pending' && (
              <CardFooter className="pt-2 border-t text-center block text-sm text-slate-500">
                Aksi telah dilakukan.
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
