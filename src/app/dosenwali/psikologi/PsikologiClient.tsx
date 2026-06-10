"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, FileSearch, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PsikologiClient({ mahasiswa }: { mahasiswa: any[] }) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [psikoData, setPsikoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPsikologi = async (mhs: any) => {
    setSelectedStudent(mhs);
    setIsLoading(true);
    setPsikoData(null);
    try {
      const res = await fetch(`/api/psikologi?mahasiswaId=${mhs.id}`);
      if (!res.ok) throw new Error("Gagal mengambil data tes psikologi");
      const data = await res.json();
      setPsikoData(data);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memuat data psikologi dari API Eksternal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 dark:border-slate-800">
            <TableHead>Mahasiswa</TableHead>
            <TableHead>NRP</TableHead>
            <TableHead>Angkatan</TableHead>
            <TableHead className="text-right">Integrasi Data Psikologi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mahasiswa.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-slate-500">Tidak ada mahasiswa binaan.</TableCell>
            </TableRow>
          ) : (
            mahasiswa.map((mhs: any) => (
              <TableRow key={mhs.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <TableCell className="font-medium">{mhs.nama}</TableCell>
                <TableCell className="text-slate-500">{mhs.nrp}</TableCell>
                <TableCell>{mhs.angkatan}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="glass-card h-8"
                    onClick={() => fetchPsikologi(mhs)}
                  >
                    <FileSearch className="w-4 h-4 mr-1 text-indigo-500" /> Tinjau Hasil Tes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="glass-panel border-none sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Laporan Psikologi Eksternal
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 min-h-[300px] flex flex-col">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{selectedStudent?.nama}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedStudent?.nrp}</p>
            </div>
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="animate-pulse">Mengambil data dari API PENS...</p>
              </div>
            ) : psikoData ? (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Status Mental</p>
                    <div className="flex items-center gap-2 font-bold text-lg text-indigo-700 dark:text-indigo-400">
                      <ShieldCheck className="w-5 h-5" /> {psikoData.status_mental}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Risiko Dropout Akademik</p>
                    <div className="flex items-center gap-2 font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      <ShieldAlert className="w-5 h-5 opacity-50" /> {psikoData.risiko_dropout}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Skor Dimensi Psikologis</h4>
                  <div className="space-y-3">
                    {psikoData.skor_kategori.map((skor: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skor.kategori}</span>
                          <span className="font-bold">{skor.nilai}/100</span>
                        </div>
                        <Progress value={skor.nilai} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                  <p className="font-semibold mb-1">Rekomendasi Bimbingan:</p>
                  <p className="text-slate-700 dark:text-slate-300">{psikoData.rekomendasi}</p>
                </div>
                
                <p className="text-xs text-right text-slate-400">
                  Data disinkronkan pada: {new Date(psikoData.tanggal_tes).toLocaleString('id-ID')}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Data tidak ditemukan.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
