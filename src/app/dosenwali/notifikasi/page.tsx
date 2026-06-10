"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const mockNotifikasi = [
  { id: 'n1', jenis: 'NILAI_RENDAH', pesan: 'Mahasiswa Budi Gunawan mendapat nilai D pada mata kuliah Struktur Data.', status: 'BARU', tanggal: '2023-11-20T10:00:00Z', mhsId: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c12', namaMhs: 'Budi Gunawan' },
  { id: 'n2', jenis: 'KEHADIRAN_BURUK', pesan: 'Kehadiran Deni Setiawan pada mata kuliah Jaringan Komputer di bawah 75%.', status: 'DIBACA', tanggal: '2023-11-18T14:30:00Z', mhsId: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c14', namaMhs: 'Deni Setiawan' },
  { id: 'n3', jenis: 'SEMESTER_ANTARA', pesan: 'Eka Putri sedang menempuh Semester Antara.', status: 'DITINDAKLANJUTI', tanggal: '2023-11-15T09:15:00Z', mhsId: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15', namaMhs: 'Eka Putri', catatan: 'Sudah dipanggil dan dinasihati.' },
];

export default function NotifikasiPage() {
  const { toast } = useToast();
  const [notifs, setNotifs] = useState(mockNotifikasi);
  const [catatan, setCatatan] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTindakLanjut = (id: string) => {
    setNotifs(notifs.map(n => 
      n.id === id ? { ...n, status: 'DITINDAKLANJUTI', catatan } : n
    ));
    setDialogOpen(false);
    setCatatan("");
    toast({
      title: "Tindak Lanjut Berhasil",
      description: "Catatan tindak lanjut telah disimpan.",
    });
  };

  const markAsRead = (id: string) => {
    setNotifs(notifs.map(n => 
      n.id === id && n.status === 'BARU' ? { ...n, status: 'DIBACA' } : n
    ));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Kelola Notifikasi
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Peringatan otomatis berdasarkan evaluasi kondisi akademik mahasiswa binaan.</p>
      </div>

      <div className="space-y-4">
        {notifs.map((notif) => (
          <Card 
            key={notif.id} 
            className={`transition-all duration-300 glass-card border-none ${notif.status === 'BARU' ? 'border-l-4 border-l-blue-500 bg-white/60 dark:bg-slate-900/60 shadow-md' : ''}`}
            onMouseEnter={() => markAsRead(notif.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={
                      notif.jenis === 'NILAI_RENDAH' ? 'destructive' : 
                      notif.jenis === 'KEHADIRAN_BURUK' ? 'destructive' : 
                      notif.jenis === 'IPK_TURUN' ? 'destructive' : 'default'
                    }>
                      {notif.jenis.replace('_', ' ')}
                    </Badge>
                    {notif.status === 'BARU' && <Badge className="bg-blue-600">Baru</Badge>}
                  </div>
                  <CardTitle className="text-lg">{notif.namaMhs}</CardTitle>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(notif.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">{notif.pesan}</p>
              
              {notif.status === 'DITINDAKLANJUTI' ? (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Telah Ditindaklanjuti
                  </p>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">&quot;{notif.catatan}&quot;</p>
                </div>
              ) : (
                <div className="mt-4">
                  <Dialog open={dialogOpen && selectedId === notif.id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) setSelectedId(notif.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="glass-card">Tindak Lanjuti</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-none">
                      <DialogHeader>
                        <DialogTitle>Tindak Lanjut Notifikasi</DialogTitle>
                        <DialogDescription>
                          Berikan catatan tindakan yang telah Anda lakukan terhadap {notif.namaMhs}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea 
                          placeholder="Contoh: Sudah dipanggil untuk pembinaan pada hari..." 
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                        <Button onClick={() => handleTindakLanjut(notif.id)} disabled={!catatan.trim()}>Simpan Tindak Lanjut</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
