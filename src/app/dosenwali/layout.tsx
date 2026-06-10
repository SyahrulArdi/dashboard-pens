"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  LineChart, 
  BookOpen, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  Award,
  Brain,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { title: "Overview", href: "/dosenwali", icon: LayoutDashboard },
  { title: "Mahasiswa Binaan", href: "/dosenwali/mahasiswa", icon: Users },
  { title: "Persetujuan KRS", href: "/dosenwali/krs", icon: BookOpen },
  { title: "Mahasiswa Bermasalah", href: "/dosenwali/bermasalah", icon: AlertTriangle },
  { title: "Grafik & IPK", href: "/dosenwali/grafik", icon: LineChart },
  { title: "Semester Antara", href: "/dosenwali/semester-antara", icon: BookOpen },
  { title: "Poin SKEM", href: "/dosenwali/skem", icon: Award },
  { title: "Tes Psikologi", href: "/dosenwali/psikologi", icon: Brain },
  { title: "Notifikasi", href: "/dosenwali/notifikasi", icon: Bell },
  { title: "Pengaturan", href: "/dosenwali/pengaturan", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const dosenUser = (session?.user as any)?.roles?.["dosen_wali"];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) return null;

  const currentNavItem = navItems.find(i => pathname === i.href || (pathname.startsWith(`${i.href}/`) && i.href !== "/dosenwali"));

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col relative z-20 shadow-xl hidden md:flex",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Header Sidebar */}
        <div className="h-20 flex items-center border-b border-slate-800 px-4">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0">
                  P
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xl font-bold tracking-wide text-white whitespace-nowrap">Wali PENS</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">Sistem Pemantauan</span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="hidden md:flex flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
                aria-label="Tutup Sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
              aria-label="Buka Sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
          {isSidebarOpen && (
            <div className="px-6 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Utama</p>
            </div>
          )}
          <nav className="space-y-2 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href}>
                  <span className={cn(
                    "flex items-center w-full rounded-xl transition-all duration-200 group cursor-pointer",
                    isSidebarOpen ? "px-4 py-3" : "p-3 justify-center",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                  title={!isSidebarOpen ? item.title : undefined}
                  >
                    <item.icon className={cn(
                      "flex-shrink-0 transition-colors", 
                      isSidebarOpen ? "mr-4 h-5 w-5" : "h-6 w-6",
                      isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                    )} />
                    {isSidebarOpen && (
                      <span className="truncate">{item.title}</span>
                    )}
                    {isActive && isSidebarOpen && (
                      <div className="ml-auto w-1.5 h-6 bg-blue-500 rounded-full" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className={cn(
            "w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-xl",
            !isSidebarOpen && "px-0 justify-center"
          )} onClick={() => signOut()}>
            <LogOut className={cn(isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6")} />
            {isSidebarOpen && <span className="font-medium">Keluar</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 bg-[#0f172a] text-slate-300 w-72 z-40 shadow-xl transition-transform duration-300 flex flex-col md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center border-b border-slate-800 px-4 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0">
              P
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xl font-bold tracking-wide text-white whitespace-nowrap">Wali PENS</span>
              <span className="text-xs text-slate-400 whitespace-nowrap">Sistem Pemantauan</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
          <div className="px-6 mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Utama</p>
          </div>
          <nav className="space-y-2 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                  <span className={cn(
                    "flex items-center w-full rounded-xl transition-all duration-200 group px-4 py-3 cursor-pointer",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}>
                    <item.icon className={cn(
                      "flex-shrink-0 transition-colors mr-4 h-5 w-5",
                      isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                    )} />
                    <span className="truncate">{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-6 bg-blue-500 rounded-full" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-xl justify-start" onClick={() => signOut()}>
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Keluar</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-6 md:px-8 justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {currentNavItem?.title || "Dashboard"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Pemantauan Akademik Mahasiswa</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200 dark:border-slate-700 outline-none">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dosenUser?.name || "Dosen Wali"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{dosenUser?.email || "dosen@pens.ac.id"}</p>
                  </div>
                  <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800 flex-shrink-0">
                    {dosenUser?.name?.charAt(0) || "D"}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950" onClick={() => signOut()}>
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0b1121] p-4 md:p-8">
          <div className="mx-auto h-full w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
