"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addSemesterAntara, deleteSemesterAntara } from "../actions";

export default function SemesterAntaraClient({ 
  initialData, 
  mahasiswa, 
  mataKuliah 
}: { 
  initialData: any[], 
  mahasiswa: any[], 
  mataKuliah: any[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    mahasiswa_id: string;
    tahun_akademik: string;
    keterangan: string;
    matkul: string[];
  }>({
    mahasiswa_id: "",
    tahun_akademik: "",
    keterangan: "",
    matkul: []
  });

  const handleToggleMatkul = (kode_mk: string) => {
    setFormData(prev => ({
      ...prev,
      matkul: prev.matkul.includes(kode_mk) 
        ? prev.matkul.filter(k => k !== kode_mk)
        : [...prev.matkul, kode_mk]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mahasiswa_id || formData.matkul.length === 0) {
      toast({ title: "Gagal", description: "Mahasiswa dan minimal 1 Mata Kuliah harus dipilih.", variant: "destructive" });
      return;
    }
    
    startTransition(async () => {
      try {
        await addSemesterAntara(formData);
        toast({ title: "Berhasil", description: "Data Semester Antara berhasil ditambahkan." });
        setIsOpen(false);
        setFormData({ mahasiswa_id: "", tahun_akademik: "", keterangan: "", matkul: [] });
      } catch (error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus data ini?")) return;
    startTransition(async () => {
      try {
        await deleteSemesterAntara(id);
        toast({ title: "Berhasil", description: "Data dihapus." });
      } catch (error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Tambah Peserta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Semester Antara</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mahasiswa</label>
                <Select value={formData.mahasiswa_id} onValueChange={(val) => setFormData({...formData, mahasiswa_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Mahasiswa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mahasiswa.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.nrp} - {m.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tahun Akademik</label>
                <Input required placeholder="Misal: 2024/2025 Genap" value={formData.tahun_akademik} onChange={e => setFormData({...formData, tahun_akademik: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Keterangan (Opsional)</label>
                <Input placeholder="Perbaikan nilai, dll" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Mata Kuliah yang Diperbaiki</label>
                <div className="max-h-[200px] overflow-y-auto border p-4 rounded-md space-y-2">
                  {mataKuliah.map((mk) => (
                    <div key={mk.kode_mk} className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        id={mk.kode_mk} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.matkul.includes(mk.kode_mk)}
                        onChange={() => handleToggleMatkul(mk.kode_mk)}
                      />
                      <label htmlFor={mk.kode_mk} className="text-sm font-medium leading-none cursor-pointer">
                        {mk.kode_mk} - {mk.nama_mk} ({mk.sks} SKS)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tahun Akademik</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead>Mata Kuliah Diambil</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Belum ada data semester antara.</TableCell>
              </TableRow>
            ) : (
              initialData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.tahun_akademik}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.mahasiswa?.nama}</div>
                    <div className="text-sm text-slate-500">{item.mahasiswa?.nrp}</div>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc pl-4 text-sm">
                      {(item.semester_antara_matkul || []).map((sam: any) => (
                        <li key={sam.kode_mk}>{sam.mata_kuliah?.nama_mk}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{item.keterangan || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
