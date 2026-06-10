"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addMataKuliah, deleteMataKuliah } from "../actions";

export default function MatkulTab({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    kode_mk: "",
    nama_mk: "",
    sks: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMataKuliah(formData);
      toast({ title: "Berhasil", description: "Mata Kuliah berhasil ditambahkan." });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    setLoading(false);
  };

  const handleDelete = async (kode_mk: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteMataKuliah(kode_mk);
      toast({ title: "Berhasil", description: "Mata Kuliah dihapus." });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Mata Kuliah</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0b668b] text-white">Tambah Mata Kuliah</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Kode MK</Label>
                <Input value={formData.kode_mk} onChange={e => setFormData({...formData, kode_mk: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Nama Mata Kuliah</Label>
                <Input value={formData.nama_mk} onChange={e => setFormData({...formData, nama_mk: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>SKS</Label>
                <Input type="number" value={formData.sks} onChange={e => setFormData({...formData, sks: parseInt(e.target.value)})} required />
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
              <TableHead>Kode MK</TableHead>
              <TableHead>Nama Mata Kuliah</TableHead>
              <TableHead>SKS</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((mk) => (
              <TableRow key={mk.kode_mk}>
                <TableCell>{mk.kode_mk}</TableCell>
                <TableCell>{mk.nama_mk}</TableCell>
                <TableCell>{mk.sks}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(mk.kode_mk)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-4">Belum ada data Mata Kuliah.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
