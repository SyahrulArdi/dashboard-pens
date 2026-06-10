"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Award } from "lucide-react";

const MIN_SKEM = 100;

export default function SKEMClient({ data }: { data: any[] }) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const calculateTotalPoin = (skemList: any[]) => {
    return skemList?.filter(s => s.status === 'DIVALIDASI')
      .reduce((total, s) => total + s.poin, 0) || 0;
  };

  return (
    <div className="glass-panel p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 dark:border-slate-800">
            <TableHead>Mahasiswa</TableHead>
            <TableHead>Total Poin</TableHead>
            <TableHead>Progress Kelulusan SKEM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">Tidak ada data mahasiswa.</TableCell>
            </TableRow>
          ) : (
            data.map((mhs: any) => {
              const totalPoin = calculateTotalPoin(mhs.skem_mahasiswa);
              const progress = Math.min((totalPoin / MIN_SKEM) * 100, 100);
              const isLulus = totalPoin >= MIN_SKEM;

              return (
                <TableRow key={mhs.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell>
                    <div className="font-medium">{mhs.nama}</div>
                    <div className="text-xs text-slate-500">{mhs.nrp}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{totalPoin}</span> / {MIN_SKEM} Poin
                  </TableCell>
                  <TableCell className="w-1/3">
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="h-2 w-full" />
                      <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isLulus ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Memenuhi Syarat</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-600">Belum Memenuhi</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="glass-card h-8"
                      onClick={() => setSelectedStudent(mhs)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> Detail
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="glass-panel border-none sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Detail SKEM Mahasiswa
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-semibold text-lg">{selectedStudent?.nama}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedStudent?.nrp}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium">Total Poin Valid:</span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {selectedStudent ? calculateTotalPoin(selectedStudent.skem_mahasiswa) : 0} Poin
                </span>
              </div>
            </div>

            <h4 className="font-medium mb-3 text-sm text-slate-500 uppercase tracking-wider">Riwayat Kegiatan</h4>
            <div className="space-y-3">
              {selectedStudent?.skem_mahasiswa?.length > 0 ? (
                selectedStudent.skem_mahasiswa.map((item: any) => (
                  <div key={item.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{item.nama_kegiatan}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.kategori} &bull; {new Date(item.tanggal_kegiatan).toLocaleDateString("id-ID")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">+{item.poin}</div>
                      <div className="text-[10px] uppercase font-semibold mt-1 tracking-wider text-slate-400">{item.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">Belum ada riwayat kegiatan SKEM.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
