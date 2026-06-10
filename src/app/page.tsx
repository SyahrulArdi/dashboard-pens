import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, LayoutDashboard, Bell, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Logo PENS" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-[#0b668b] dark:text-[#369fc9]">Dashboard PENS</span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="bg-[#0b668b] hover:bg-[#004e71] text-white">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-28 overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                  Sistem Informasi Akademik PENS
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                  Monitoring Akademik Mahasiswa Wali
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Platform terintegrasi bagi Dosen Wali Politeknik Elektronika Negeri Surabaya untuk memantau performa, kehadiran, dan menyetujui KRS mahasiswa secara real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-14 px-8 bg-[#0b668b] hover:bg-[#004e71] text-white text-base">
                    <Link href="/login">
                      Masuk Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-slate-300 text-slate-700">
                    <Link href="#fitur">
                      Pelajari Fitur
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0b668b]/20 to-transparent rounded-3xl blur-3xl transform -rotate-6"></div>
                <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-[#0b668b]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Tinjauan Akademik</div>
                        <div className="text-xs text-slate-500">Semester Ganjil 2023/2024</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-6 w-16 bg-[#0b668b] rounded opacity-80"></div>
                      </div>
                      <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="h-24 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-6 w-20 bg-red-400 rounded opacity-80"></div>
                      </div>
                      <Bell className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Fitur Utama Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Sistem ini dirancang khusus untuk mempermudah tugas Dosen Wali dalam memberikan bimbingan dan pemantauan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="bg-blue-50 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <LayoutDashboard className="h-7 w-7 text-[#0b668b] dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Tinjauan Menyeluruh</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lihat daftar seluruh mahasiswa binaan Anda, periksa IPK kumulatif, IPS, dan data akademik lainnya dalam satu layar.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="bg-red-50 dark:bg-red-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Bell className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Deteksi Dini Masalah</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Terima notifikasi otomatis untuk mahasiswa dengan kehadiran buruk, nilai rendah, atau IPK kritis.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="bg-green-50 dark:bg-green-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Grafik Analitik</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Visualisasi grafik mempermudah pembacaan tren nilai dan distribusi perolehan nilai setiap semesternya.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Logo PENS" fill className="object-contain opacity-70 grayscale hover:grayscale-0 transition-all" />
            </div>
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Dashboard PENS</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Politeknik Elektronika Negeri Surabaya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
