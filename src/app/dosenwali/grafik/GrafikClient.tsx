"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siaClient } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Mahasiswa {
  id: string;
  nama: string;
  nrp: string;
  ipk: number;
  semester_terbaru: number;
}

export default function GrafikClient({ mahasiswaList }: { mahasiswaList: Mahasiswa[] }) {
  const [selectedMhsId, setSelectedMhsId] = useState<string>(mahasiswaList[0]?.id ?? "");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const selectedMhs = mahasiswaList.find((m) => m.id === selectedMhsId);

  const { data: ipkHistory, isLoading: loadingIpk } = useQuery({
    queryKey: ["ipk-history", selectedMhsId],
    queryFn: () => siaClient.getIpkHistory(selectedMhsId),
    enabled: !!selectedMhsId,
  });

  const semesterOptions = ipkHistory
    ? ipkHistory.map((h) => ({ value: String(h.semester), label: `Semester ${h.semester}` }))
    : [];

  const { data: nilaiData, isLoading: loadingNilai } = useQuery({
    queryKey: ["nilai", selectedMhsId, selectedSemester],
    queryFn: () => {
      const sem = selectedSemester === "all"
        ? (ipkHistory?.[ipkHistory.length - 1]?.semester ?? 1)
        : parseInt(selectedSemester);
      return siaClient.getNilai(selectedMhsId, sem);
    },
    enabled: !!selectedMhsId && (selectedSemester !== "all" || !!ipkHistory),
  });

  const distribusiNilai = ["A", "AB", "B", "BC", "C", "D", "E"].map((huruf) => ({
    huruf,
    jumlah: nilaiData?.filter((n) => n.nilai_huruf === huruf).length ?? 0,
  }));

  // Hitung tren IPK (naik/turun)
  const trendIcon = () => {
    if (!ipkHistory || ipkHistory.length < 2) return <Minus className="h-4 w-4 text-slate-400" />;
    const last = ipkHistory[ipkHistory.length - 1].ipk;
    const prev = ipkHistory[ipkHistory.length - 2].ipk;
    if (last > prev) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (last < prev) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  if (mahasiswaList.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Tidak ada mahasiswa binaan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Mahasiswa */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-80">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Pilih Mahasiswa</label>
          <Select value={selectedMhsId} onValueChange={setSelectedMhsId}>
            <SelectTrigger className="bg-white dark:bg-slate-950">
              <SelectValue placeholder="Pilih Mahasiswa" />
            </SelectTrigger>
            <SelectContent>
              {mahasiswaList.map((mhs) => (
                <SelectItem key={mhs.id} value={mhs.id}>
                  {mhs.nama} ({mhs.nrp})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedMhs && (
          <div className="flex items-end gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-slate-500 uppercase font-semibold">IPK Sekarang</p>
              <div className="flex items-center gap-2 mt-1">
                {trendIcon()}
                <span className={`text-2xl font-bold ${selectedMhs.ipk < 2.5 ? "text-red-600" : "text-indigo-700 dark:text-indigo-400"}`}>
                  {selectedMhs.ipk.toFixed(2)}
                </span>
              </div>
            </div>
            <Badge
              variant={selectedMhs.ipk >= 3.5 ? "default" : selectedMhs.ipk >= 2.5 ? "secondary" : "destructive"}
              className="h-8 px-3 text-sm"
            >
              {selectedMhs.ipk >= 3.5 ? "Sangat Baik" : selectedMhs.ipk >= 2.5 ? "Baik" : "Perlu Perhatian"}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grafik IPK & IPS per Semester */}
        <Card className="shadow-sm glass-panel border-none">
          <CardHeader>
            <CardTitle>Tren IPK & IPS per Semester</CardTitle>
            <CardDescription>Pergerakan IPK kumulatif dan IPS tiap semester.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full mt-2">
              {loadingIpk ? (
                <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">
                  Memuat grafik...
                </div>
              ) : !ipkHistory || ipkHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Belum ada data IPK untuk mahasiswa ini.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ipkHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="semester" tickFormatter={(v) => `Smt ${v}`} tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                      formatter={(value: number) => [value.toFixed(2)]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ipk"
                      stroke="#4f46e5"
                      name="IPK Kumulatif"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#4f46e5" }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ips"
                      stroke="#10b981"
                      name="IPS (Semester)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grafik Distribusi Nilai */}
        <Card className="shadow-sm glass-panel border-none">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>Distribusi Nilai</CardTitle>
                <CardDescription>Jumlah nilai huruf per semester.</CardDescription>
              </div>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[150px] bg-white dark:bg-slate-950 text-sm">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full mt-2">
              {loadingNilai ? (
                <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">
                  Memuat grafik...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribusiNilai} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="huruf" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="jumlah"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                      name="Jumlah Mata Kuliah"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
