"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, AlertTriangle, FileWarning, Send } from "lucide-react";
import Link from "next/link";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { laporPPKS } from "../actions";

interface MahasiswaBermasalah {
  id: string;
  nrp: string;
  nama: string;
  ipk: number;
  persentase_kehadiran: number;
  masalah: string[];
}

export default function BermasalahClient({
  data,
  dosenWaliId,
}: {
  data: MahasiswaBermasalah[];
  dosenWaliId: string;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMasalah, setFilterMasalah] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMhs, setSelectedMhs] = useState<MahasiswaBermasalah | null>(null);
  const [jenis, setJenis] = useState("Nilai Berulang Rendah");
  const [deskripsi, setDeskripsi] = useState("");

  const filteredData = data.filter((m) => {
    const matchName =
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nrp.includes(searchTerm);
    const matchMasalah =
      filterMasalah === "all" || m.masalah.some((ms) => ms.includes(filterMasalah));
    return matchName && matchMasalah;
  });

  const handleLapor = (mhs: MahasiswaBermasalah) => {
    setSelectedMhs(mhs);
    setDeskripsi(
      `Mahasiswa ${mhs.nama} (${mhs.nrp}) memiliki IPK ${mhs.ipk.toFixed(2)} dan kehadiran ${mhs.persentase_kehadiran}%. Perlu penanganan lebih lanjut.`
    );
    setDialogOpen(true);
  };

  const handleSubmitLaporan = () => {
    if (!selectedMhs || !deskripsi.trim()) return;
    startTransition(async () => {
      try {
        await laporPPKS({
          mahasiswa_id: selectedMhs.id,
          pelapor_id: dosenWaliId,
          jenis_laporan: jenis,
          deskripsi,
        });
        toast({ title: "Laporan Terkirim", description: `Laporan untuk ${selectedMhs.nama} telah dikirimkan ke Tim PPKS.` });
        setDialogOpen(false);
        setDeskripsi("");
      } catch {
        toast({ title: "Gagal", description: "Terjadi kesalahan saat mengirim laporan.", variant: "destructive" });
      }
    });
  };

  return (
    <>
      <Card className="border-red-200 dark:border-red-900 shadow-sm">
        <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-red-800 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Tabel Evaluasi
              </CardTitle>
              <CardDescription>Menampilkan {filteredData.length} dari {data.length} mahasiswa bermasalah.</CardDescription>
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
              <Select value={filterMasalah} onValueChange={setFilterMasalah}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Jenis Masalah" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Masalah</SelectItem>
                  <SelectItem value="IPK Rendah">IPK Rendah</SelectItem>
                  <SelectItem value="Kehadiran Buruk">Kehadiran Buruk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">NRP</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>IPK</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Jenis Masalah</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    {data.length === 0
                      ? "🎉 Tidak ada mahasiswa bermasalah saat ini!"
                      : "Tidak ada hasil untuk filter ini."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((mhs) => (
                  <TableRow key={mhs.id}>
                    <TableCell className="font-medium font-mono">{mhs.nrp}</TableCell>
                    <TableCell className="font-medium">{mhs.nama}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${mhs.ipk < 2.5 ? "text-red-600" : "text-slate-700 dark:text-slate-300"}`}>
                        {mhs.ipk.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${mhs.persentase_kehadiran < 75 ? "text-orange-600" : "text-slate-700 dark:text-slate-300"}`}>
                        {mhs.persentase_kehadiran}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mhs.masalah.map((ms) => (
                          <Badge key={ms} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 border-none text-xs">
                            {ms}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dosenwali/mahasiswa/${mhs.id}`}>Detail</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleLapor(mhs)}
                        >
                          <Send className="h-3 w-3 mr-1" /> Lapor PPKS
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Laporan PPKS */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-red-500" /> Laporan ke Tim PPKS
            </DialogTitle>
            <DialogDescription>
              Kirimkan laporan mengenai kondisi akademik <strong>{selectedMhs?.nama}</strong> ke Tim PPKS PENS untuk penanganan lebih lanjut.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Jenis Laporan</label>
              <Select value={jenis} onValueChange={setJenis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nilai Berulang Rendah">Nilai Berulang Rendah</SelectItem>
                  <SelectItem value="Kehadiran Buruk">Kehadiran Buruk</SelectItem>
                  <SelectItem value="Masalah Akademik Serius">Masalah Akademik Serius</SelectItem>
                  <SelectItem value="Masalah Non-Akademik">Masalah Non-Akademik</SelectItem>
                  <SelectItem value="Potensi Drop Out">Potensi Drop Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi Masalah</label>
              <Textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                placeholder="Jelaskan kondisi mahasiswa secara detail..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleSubmitLaporan}
              disabled={isPending || !deskripsi.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
