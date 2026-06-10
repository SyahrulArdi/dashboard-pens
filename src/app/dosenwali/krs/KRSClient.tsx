"use client";

import { useState } from "react";
import { updateStatusKRS } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";

export default function KRSClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [selectedKrs, setSelectedKrs] = useState<any>(null);
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (status: string) => {
    if (!selectedKrs) return;
    setIsSubmitting(true);
    try {
      await updateStatusKRS(selectedKrs.id, status, catatan);
      setData(data.map(item => item.id === selectedKrs.id ? { ...item, status, catatan_dosen: catatan } : item));
      setSelectedKrs(null);
      setCatatan("");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISETUJUI": return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case "DITOLAK": return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      default: return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
    }
  };

  return (
    <div className="glass-panel p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 dark:border-slate-800">
            <TableHead>Mahasiswa</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Diajukan Pada</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">Tidak ada pengajuan KRS.</TableCell>
            </TableRow>
          ) : (
            data.map((item: any) => (
              <TableRow key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <TableCell>
                  <div className="font-medium">{item.mahasiswa?.nama}</div>
                  <div className="text-xs text-slate-500">{item.mahasiswa?.nrp}</div>
                </TableCell>
                <TableCell>Semester {item.semester}</TableCell>
                <TableCell className="text-slate-500 text-sm">{new Date(item.diajukan_pada).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dosenwali/mahasiswa/${item.mahasiswa?.id}`}>
                      <Button variant="outline" size="sm" className="h-8 glass-card">
                        <Eye className="w-4 h-4 mr-1" /> Nilai
                      </Button>
                    </Link>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedKrs(item);
                        setCatatan(item.catatan_dosen || "");
                      }}
                    >
                      Tinjau
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedKrs} onOpenChange={(open) => !open && setSelectedKrs(null)}>
        <DialogContent className="glass-panel border-none sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tinjauan KRS</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm font-medium">Mahasiswa:</p>
              <p className="text-lg">{selectedKrs?.mahasiswa?.nama} ({selectedKrs?.mahasiswa?.nrp})</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="catatan" className="text-sm font-medium">Catatan (Opsional)</label>
              <Textarea 
                id="catatan" 
                value={catatan} 
                onChange={(e) => setCatatan(e.target.value)} 
                placeholder="Berikan catatan perwalian..."
                className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between gap-2 sm:justify-end">
            <Button 
              variant="destructive" 
              onClick={() => handleAction("DITOLAK")}
              disabled={isSubmitting}
            >
              Tolak
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white" 
              onClick={() => handleAction("DISETUJUI")}
              disabled={isSubmitting}
            >
              Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
