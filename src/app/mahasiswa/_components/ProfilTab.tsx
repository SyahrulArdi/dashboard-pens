"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, GraduationCap, Calendar, Landmark } from "lucide-react";

export default function ProfilTab({ profil }: { profil: any }) {
  if (!profil) return <p>Data profil tidak ditemukan.</p>;

  // Ambil data dosen wali pertama dari relasi perwalian
  const dosenWali = profil.perwalian?.[0]?.dosen_wali;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Profil Akademik</h3>
          <p className="text-slate-500">Informasi data diri dan dosen wali pembimbing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-white">
              <User className="h-5 w-5 text-blue-500" />
              Data Mahasiswa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Nama Lengkap</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{profil.nama}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">NRP</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{profil.nrp}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{profil.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Program Studi
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{profil.program_studi}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Angkatan
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{profil.angkatan}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-white">
              <Landmark className="h-5 w-5 text-emerald-500" />
              Dosen Wali Pembimbing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dosenWali ? (
              <>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Nama Dosen</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dosenWali.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">NIP</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dosenWali.nip}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dosenWali.email}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">Anda belum dipetakan ke Dosen Wali. Silakan hubungi Admin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
