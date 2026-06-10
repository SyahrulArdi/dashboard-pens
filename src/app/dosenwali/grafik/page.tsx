"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siaClient } from "@/lib/sia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart as LineChartIcon } from "lucide-react";

const mockMahasiswaList = [
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c11', nama: 'Andi Pratama' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c12', nama: 'Budi Gunawan' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c13', nama: 'Citra Lestari' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c14', nama: 'Deni Setiawan' },
  { id: 'a1b1a8f9-4b0c-4e8c-8f9f-7e9b0a1b2c15', nama: 'Eka Putri' },
];

export default function GrafikPage() {
  const [selectedMhs, setSelectedMhs] = useState<string>(mockMahasiswaList[0].id);

  const { data: ipkHistory, isLoading: loadingIpk } = useQuery({
    queryKey: ['ipk', selectedMhs],
    queryFn: () => siaClient.getIpkHistory(selectedMhs)
  });

  const { data: nilai, isLoading: loadingNilai } = useQuery({
    queryKey: ['nilai', selectedMhs, 3], // mock semester 3
    queryFn: () => siaClient.getNilai(selectedMhs, 3)
  });

  const distribusiNilai = [
    { huruf: 'A', jumlah: nilai?.filter(n => n.nilai_huruf === 'A').length || 0 },
    { huruf: 'AB', jumlah: nilai?.filter(n => n.nilai_huruf === 'AB').length || 0 },
    { huruf: 'B', jumlah: nilai?.filter(n => n.nilai_huruf === 'B').length || 0 },
    { huruf: 'BC', jumlah: nilai?.filter(n => n.nilai_huruf === 'BC').length || 0 },
    { huruf: 'C', jumlah: nilai?.filter(n => n.nilai_huruf === 'C').length || 0 },
    { huruf: 'D', jumlah: nilai?.filter(n => n.nilai_huruf === 'D').length || 0 },
    { huruf: 'E', jumlah: nilai?.filter(n => n.nilai_huruf === 'E').length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LineChartIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Grafik Akademik
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Analisis visual tren IPK dan distribusi nilai per mahasiswa.</p>
        </div>
        
        <div className="w-full sm:w-72">
          <Select value={selectedMhs} onValueChange={setSelectedMhs}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-950">
              <SelectValue placeholder="Pilih Mahasiswa" />
            </SelectTrigger>
            <SelectContent>
              {mockMahasiswaList.map(mhs => (
                <SelectItem key={mhs.id} value={mhs.id}>{mhs.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Tren IPK per Semester</CardTitle>
            <CardDescription>Grafik pergerakan nilai IPK secara individual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              {loadingIpk ? (
                <div className="h-full flex items-center justify-center text-slate-500">Memuat grafik...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ipkHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="semester" tickFormatter={(v) => `Smt ${v}`} />
                    <YAxis domain={[0, 4]} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="ipk" stroke="#4f46e5" name="IPK Kumulatif" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ips" stroke="#10b981" name="IPS (Semester)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Distribusi Nilai (Semester Berjalan)</CardTitle>
            <CardDescription>Jumlah perolehan nilai huruf pada semester saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              {loadingNilai ? (
                <div className="h-full flex items-center justify-center text-slate-500">Memuat grafik...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribusiNilai} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="huruf" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="jumlah" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Jumlah Mata Kuliah" />
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
