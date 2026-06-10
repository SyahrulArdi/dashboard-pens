"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { submitKRS } from "../actions";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function KRSTab({ profil, krs }: { profil: any, krs: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    semester: "",
    file_krs_url: "",
    pesan_mahasiswa: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validasi dosen wali ada
    const dosenWaliId = profil?.perwalian?.[0]?.dosen_wali?.id;
    if (!dosenWaliId) {
      toast({
        variant: "destructive",
        title: "Gagal Mengajukan",
        description: "Anda belum memiliki dosen wali. Harap hubungi Admin."
      });
      setLoading(false);
      return;
    }

    try {
      await submitKRS({
        mahasiswa_id: profil.id,
        dosen_wali_id: dosenWaliId,
        semester: parseInt(formData.semester),
        file_krs_url: formData.file_krs_url,
        pesan_mahasiswa: formData.pesan_mahasiswa
      });

      toast({
        title: "KRS Berhasil Diajukan",
        description: "Menunggu persetujuan Dosen Wali."
      });
      setIsOpen(false);
      setFormData({ semester: "", file_krs_url: "", pesan_mahasiswa: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Pengajuan KRS</h3>
          <p className="text-slate-500">Ajukan persetujuan Kartu Rencana Studi ke Dosen Wali.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              Ajukan KRS Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>Form Pengajuan Persetujuan KRS</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester" 
                  type="number" 
                  min="1" max="14"
                  placeholder="Misal: 3"
                  value={formData.semester}
                  onChange={e => setFormData({...formData, semester: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_krs">Link File Bukti KRS (PDF/Drive)</Label>
                <Input 
                  id="file_krs" 
                  type="url"
                  placeholder="https://docs.google.com/..."
                  value={formData.file_krs_url}
                  onChange={e => setFormData({...formData, file_krs_url: e.target.value})}
                />
                <p className="text-xs text-slate-500">Opsional jika diwajibkan oleh dosen wali.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan untuk Dosen Wali (Opsional)</Label>
                <Input 
                  id="pesan" 
                  placeholder="Pesan tambahan..."
                  value={formData.pesan_mahasiswa}
                  onChange={e => setFormData({...formData, pesan_mahasiswa: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Menyimpan..." : "Kirim Pengajuan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-[100px]">Semester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pesan Saya</TableHead>
              <TableHead>Balasan Dosen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {krs && krs.length > 0 ? krs.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-slate-600 dark:text-slate-400">Smst {item.semester}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.status_persetujuan === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    item.status_persetujuan === 'DITOLAK' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {item.status_persetujuan === 'DISETUJUI' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {item.status_persetujuan === 'DITOLAK' && <XCircle className="h-3.5 w-3.5" />}
                    {item.status_persetujuan === 'PENDING' && <Clock className="h-3.5 w-3.5" />}
                    {item.status_persetujuan}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                  {item.pesan_mahasiswa || "-"}
                  {item.file_krs_url && (
                    <a href={item.file_krs_url} target="_blank" rel="noreferrer" className="block text-blue-500 hover:underline mt-1 text-xs">
                      [Lihat File]
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                  {item.pesan_dosen || "-"}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  Belum ada riwayat pengajuan KRS.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
