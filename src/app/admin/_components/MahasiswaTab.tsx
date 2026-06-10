"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addMahasiswa, deleteMahasiswa } from "../actions";

export default function MahasiswaTab({ initialData }: { initialData: any[] }) {
  const [data, _setData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nrp: "",
    nama: "",
    email: "",
    angkatan: new Date().getFullYear(),
    program_studi: "D4 Teknik Informatika",
    password_hash: "password",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMahasiswa(formData);
      toast({ title: "Berhasil", description: "Mahasiswa berhasil ditambahkan." });
      // In a real app, you'd want to re-fetch the data or use router.refresh() 
      // but Server Actions revalidatePath handles it if we refresh the route.
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteMahasiswa(id);
      toast({ title: "Berhasil", description: "Mahasiswa dihapus." });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Mahasiswa</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0b668b] text-white">Tambah Mahasiswa</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>NRP</Label>
                <Input value={formData.nrp} onChange={e => setFormData({...formData, nrp: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Angkatan</Label>
                <Input type="number" value={formData.angkatan} onChange={e => setFormData({...formData, angkatan: parseInt(e.target.value)})} required />
              </div>
              <div className="space-y-2">
                <Label>Program Studi</Label>
                <Input value={formData.program_studi} onChange={e => setFormData({...formData, program_studi: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Password (Default: password)</Label>
                <Input value={formData.password_hash} onChange={e => setFormData({...formData, password_hash: e.target.value})} required />
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
              <TableHead>NRP</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Angkatan</TableHead>
              <TableHead>Prodi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((mhs) => (
              <TableRow key={mhs.id}>
                <TableCell>{mhs.nrp}</TableCell>
                <TableCell>{mhs.nama}</TableCell>
                <TableCell>{mhs.email}</TableCell>
                <TableCell>{mhs.angkatan}</TableCell>
                <TableCell>{mhs.program_studi}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(mhs.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-4">Belum ada data mahasiswa.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
