"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, RefreshCcw } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { evaluasiKondisiAkademik, tandaiNotifikasiDibaca, tindakLanjutiNotifikasi } from "../actions";

export default function NotifikasiClient({ data, dosenWaliId }: { data: any[]; dosenWaliId: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isEvaluating, startEvaluating] = useTransition();
  const [catatan, setCatatan] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTindakLanjut = (notifId: string) => {
    if (!catatan.trim()) return;
    startTransition(async () => {
      try {
        await tindakLanjutiNotifikasi(notifId, dosenWaliId, catatan);
        toast({ title: "Tindak Lanjut Berhasil", description: "Catatan tindak lanjut telah disimpan." });
        setDialogOpen(false);
        setCatatan("");
      } catch (err) {
        toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
      }
    });
  };

  const handleMarkAsRead = (id: string, status: string) => {
    if (status !== "BARU") return;
    startTransition(async () => {
      await tandaiNotifikasiDibaca(id);
    });
  };

  const handleEvaluasi = () => {
    startEvaluating(async () => {
      try {
        const { inserted } = await evaluasiKondisiAkademik(dosenWaliId);
        toast({
          title: "Evaluasi Selesai",
          description: inserted > 0 ? `Ditemukan ${inserted} notifikasi baru.` : "Tidak ada notifikasi baru ditemukan.",
        });
      } catch (err) {
        toast({ title: "Gagal Evaluasi", description: "Terjadi kesalahan.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleEvaluasi}
          disabled={isEvaluating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          {isEvaluating ? (
            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Bell className="h-4 w-4 mr-2" />
          )}
          {isEvaluating ? "Mengevaluasi..." : "Evaluasi Kondisi Sekarang"}
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 glass-card">
          Belum ada notifikasi sama sekali.
        </div>
      ) : (
        data.map((notif) => (
          <Card
            key={notif.id}
            className={`transition-all duration-300 glass-card border-none ${
              notif.status === "BARU" ? "border-l-4 border-l-blue-500 bg-white/60 dark:bg-slate-900/60 shadow-md" : ""
            }`}
            onMouseEnter={() => handleMarkAsRead(notif.id, notif.status)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        notif.jenis_kondisi === "NILAI_RENDAH" ||
                        notif.jenis_kondisi === "KEHADIRAN_BURUK" ||
                        notif.jenis_kondisi === "IPK_TURUN"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {notif.jenis_kondisi.replace("_", " ")}
                    </Badge>
                    {notif.status === "BARU" && <Badge className="bg-blue-600">Baru</Badge>}
                  </div>
                  <CardTitle className="text-lg">{notif.mahasiswa?.nama}</CardTitle>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(notif.dibangkitkan_pada).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">{notif.pesan}</p>

              {notif.status === "DITINDAKLANJUTI" ? (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Telah Ditindaklanjuti
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <Dialog
                    open={dialogOpen && selectedId === notif.id}
                    onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (open) setSelectedId(notif.id);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="glass-card">
                        Tindak Lanjuti
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-none">
                      <DialogHeader>
                        <DialogTitle>Tindak Lanjut Notifikasi</DialogTitle>
                        <DialogDescription>
                          Berikan catatan tindakan yang telah Anda lakukan terhadap {notif.mahasiswa?.nama}.
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
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button
                          onClick={() => handleTindakLanjut(notif.id)}
                          disabled={!catatan.trim() || isPending}
                        >
                          {isPending ? "Menyimpan..." : "Simpan Tindak Lanjut"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
