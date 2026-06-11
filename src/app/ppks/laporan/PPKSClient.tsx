"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, FileText, CheckCircle2, Clock } from "lucide-react";
import { updateStatusLaporanPPKS } from "../actions";

export default function PPKSClient({ data }: { data: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [tindakLanjut, setTindakLanjut] = useState("");

  const filteredData = data.filter((item) => {
    const matchSearch = item.mahasiswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.mahasiswa?.nrp.includes(searchTerm);
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleTindakLanjut = (laporan: any) => {
    setSelectedLaporan(laporan);
    setStatus(laporan.status);
    setTindakLanjut(laporan.tindak_lanjut || "");
    setDialogOpen(true);
  };

  const handleSimpan = () => {
    if (!selectedLaporan) return;
    startTransition(async () => {
      try {
        await updateStatusLaporanPPKS(selectedLaporan.id, status, tindakLanjut);
        toast({ title: "Berhasil", description: "Status dan tindak lanjut laporan berhasil diperbarui." });
        setDialogOpen(false);
      } catch (error) {
        toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan pembaruan.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-none shadow-sm">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Daftar Laporan
              </CardTitle>
              <CardDescription>
                Menampilkan {filteredData.length} laporan dari Dosen Wali.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Cari nama / NRP..."
                  className="pl-9 bg-white dark:bg-slate-950"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="DITERIMA">Diterima</SelectItem>
                  <SelectItem value="DIPROSES">Diproses</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tgl Lapor</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Jenis Laporan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Tidak ada laporan yang sesuai dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">
                      {new Date(item.dibuat_pada).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.mahasiswa?.nama}</p>
                      <p className="text-xs text-slate-500 font-mono">{item.mahasiswa?.nrp}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{item.dosen_wali?.nama}</p>
                      <p className="text-xs text-slate-500">Dosen Wali</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none">
                        {item.jenis_laporan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                        item.status === 'DIPROSES' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800'
                      }`}>
                        {item.status === 'SELESAI' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {item.status === 'DIPROSES' && <Clock className="h-3.5 w-3.5" />}
                        {item.status === 'DITERIMA' && <FileText className="h-3.5 w-3.5" />}
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleTindakLanjut(item)}>
                        Tindak Lanjuti
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass-panel border-none">
          <DialogHeader>
            <DialogTitle>Tindak Lanjut Laporan PPKS</DialogTitle>
            <DialogDescription>
              Perbarui status penanganan dan berikan catatan hasil konseling.
            </DialogDescription>
          </DialogHeader>
          {selectedLaporan && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mahasiswa</p>
                    <p className="font-medium text-sm">{selectedLaporan.mahasiswa?.nama} ({selectedLaporan.mahasiswa?.nrp})</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pelapor (Dosen Wali)</p>
                    <p className="font-medium text-sm">{selectedLaporan.dosen_wali?.nama}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Deskripsi Laporan</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800">
                    &ldquo;{selectedLaporan.deskripsi}&rdquo;
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Status Penanganan</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DITERIMA">Diterima</SelectItem>
                      <SelectItem value="DIPROSES">Sedang Diproses / Konseling</SelectItem>
                      <SelectItem value="SELESAI">Selesai / Kasus Ditutup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Catatan Tindak Lanjut</label>
                  <Textarea
                    value={tindakLanjut}
                    onChange={(e) => setTindakLanjut(e.target.value)}
                    rows={4}
                    placeholder="Tuliskan hasil pemanggilan, konseling, atau rekomendasi..."
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSimpan} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending ? "Menyimpan..." : "Simpan Pembaruan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
