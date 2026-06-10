"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addJadwalKuliah, deleteJadwalKuliah } from "../actions";

export default function JadwalTab({ initialData, mataKuliahOptions, dosenOptions }: { initialData: any[], mataKuliahOptions: any[], dosenOptions: any[] }) {
  const [data, setData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    kode_mk: "",
    dosen_id: "",
    hari: "Senin",
    jam_mulai: "08:00",
    jam_selesai: "10:00",
    ruang: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode_mk || !formData.dosen_id) {
      toast({ variant: "destructive", title: "Error", description: "Pilih Mata Kuliah dan Dosen Pengajar" });
      return;
    }
    
    setLoading(true);
    try {
      await addJadwalKuliah(formData);
      toast({ title: "Berhasil", description: "Jadwal Kuliah berhasil ditambahkan." });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await deleteJadwalKuliah(id);
      toast({ title: "Berhasil", description: "Jadwal Kuliah dihapus." });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Jadwal Kuliah</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0b668b] text-white">Tambah Jadwal</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Kuliah Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Mata Kuliah</Label>
                <Select value={formData.kode_mk} onValueChange={(val) => setFormData({...formData, kode_mk: val})}>
                  <SelectTrigger><SelectValue placeholder="Pilih Mata Kuliah" /></SelectTrigger>
                  <SelectContent>
                    {mataKuliahOptions.map(mk => (
                      <SelectItem key={mk.kode_mk} value={mk.kode_mk}>{mk.nama_mk} ({mk.kode_mk})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dosen Pengajar</Label>
                <Select value={formData.dosen_id} onValueChange={(val) => setFormData({...formData, dosen_id: val})}>
                  <SelectTrigger><SelectValue placeholder="Pilih Dosen" /></SelectTrigger>
                  <SelectContent>
                    {dosenOptions.map(dosen => (
                      <SelectItem key={dosen.id} value={dosen.id}>{dosen.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hari</Label>
                  <Select value={formData.hari} onValueChange={(val) => setFormData({...formData, hari: val})}>
                    <SelectTrigger><SelectValue placeholder="Pilih Hari" /></SelectTrigger>
                    <SelectContent>
                      {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ruangan</Label>
                  <Input value={formData.ruang} onChange={e => setFormData({...formData, ruang: e.target.value})} placeholder="Cth: C-305" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jam Mulai</Label>
                  <Input type="time" value={formData.jam_mulai} onChange={e => setFormData({...formData, jam_mulai: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Jam Selesai</Label>
                  <Input type="time" value={formData.jam_selesai} onChange={e => setFormData({...formData, jam_selesai: e.target.value})} required />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead>Dosen Pengajar</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((jadwal) => (
              <TableRow key={jadwal.id}>
                <TableCell>{jadwal.mata_kuliah?.nama_mk}</TableCell>
                <TableCell>{jadwal.dosen_wali?.nama}</TableCell>
                <TableCell>{jadwal.hari}</TableCell>
                <TableCell>{jadwal.jam_mulai} - {jadwal.jam_selesai}</TableCell>
                <TableCell>{jadwal.ruang}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(jadwal.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-4">Belum ada data Jadwal Kuliah.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
