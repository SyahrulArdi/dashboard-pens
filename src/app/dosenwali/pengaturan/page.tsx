"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PengaturanPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    ambang_ipk: 2.50,
    ambang_nilai_huruf: "D",
    ambang_kehadiran_persen: 75,
    aktif: true
  });

  const handleSave = () => {
    setLoading(true);
    // Simulasi save ke database
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pengaturan Disimpan",
        description: "Konfigurasi notifikasi otomatis berhasil diperbarui.",
      });
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Pengaturan Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Atur parameter dan ambang batas untuk fitur peringatan otomatis.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Notifikasi Akademik</CardTitle>
          <CardDescription>
            Sistem akan melakukan evaluasi otomatis dan mengirimkan notifikasi kepada Anda jika mahasiswa melewati ambang batas di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Aktifkan Notifikasi Otomatis</Label>
              <p className="text-sm text-slate-500">Terima pemberitahuan saat ada masalah akademik.</p>
            </div>
            <Switch 
              checked={config.aktif}
              onCheckedChange={(c) => setConfig({ ...config, aktif: c })}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="ambang_ipk">Ambang Batas Kritis IPK</Label>
              <p className="text-sm text-slate-500 mb-2">Notifikasi akan muncul jika IPK mahasiswa turun di bawah nilai ini.</p>
              <Input 
                id="ambang_ipk" 
                type="number" 
                step="0.01" 
                min="0" 
                max="4" 
                value={config.ambang_ipk}
                onChange={(e) => setConfig({ ...config, ambang_ipk: parseFloat(e.target.value) })}
                disabled={!config.aktif}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ambang_nilai">Ambang Batas Nilai Huruf Rendah</Label>
              <p className="text-sm text-slate-500 mb-2">Notifikasi akan muncul jika mahasiswa mendapat nilai ini atau lebih buruk (contoh: D atau E).</p>
              <select 
                id="ambang_nilai"
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                value={config.ambang_nilai_huruf}
                onChange={(e) => setConfig({ ...config, ambang_nilai_huruf: e.target.value })}
                disabled={!config.aktif}
              >
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ambang_kehadiran">Ambang Batas Kehadiran Minimal (%)</Label>
              <p className="text-sm text-slate-500 mb-2">Notifikasi akan muncul jika kehadiran mahasiswa di bawah persentase ini.</p>
              <Input 
                id="ambang_kehadiran" 
                type="number" 
                min="0" 
                max="100" 
                value={config.ambang_kehadiran_persen}
                onChange={(e) => setConfig({ ...config, ambang_kehadiran_persen: parseInt(e.target.value) })}
                disabled={!config.aktif}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 mt-4 rounded-b-xl border-t border-slate-200 dark:border-slate-800 p-4">
          <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto ml-auto">
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
