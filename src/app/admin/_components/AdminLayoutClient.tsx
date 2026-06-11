"use client";

import { useState, useEffect, ReactNode } from "react";
import { 
  Users, 
  UserSquare2, 
  ShieldAlert, 
  BookOpen, 
  CalendarDays,
  Menu,
  X,
  LogOut,
  Search,
  Bell
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Auto-close sidebar on small screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { href: "/admin/mahasiswa", label: "Data Mahasiswa", icon: Users },
    { href: "/admin/dosen", label: "Dosen Wali", icon: UserSquare2 },
    { href: "/admin/matkul", label: "Mata Kuliah", icon: BookOpen },
    { href: "/admin/jadwal", label: "Jadwal Kuliah", icon: CalendarDays },
    { href: "/admin/semester-antara", label: "Semester Antara", icon: BookOpen },
    { href: "/admin/ppks", label: "Tim PPKS", icon: ShieldAlert },
  ];

  if (!isMounted) return null;

  const currentMenuItem = menuItems.find(m => pathname.startsWith(m.href)) || menuItems[0];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col relative z-20 shadow-xl",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Header Sidebar */}
        <div className="h-20 flex items-center border-b border-slate-800 px-4">
          {isSidebarOpen ? (
            // Expanded: logo + title on left, X button on right
            <>
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/logo.png" alt="Logo PENS" fill className="object-contain" priority />
              </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xl font-bold tracking-wide text-white whitespace-nowrap">Dashboard</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">Sistem Akademik Kampus</span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
                aria-label="Tutup Sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            // Collapsed: centered hamburger icon
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
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full rounded-xl transition-all duration-200 group cursor-pointer",
                    isSidebarOpen ? "px-4 py-3" : "p-3 justify-center",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon className={cn(
                    "flex-shrink-0 transition-colors", 
                    isSidebarOpen ? "mr-4 h-5 w-5" : "h-6 w-6",
                    isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                  )} />
                  {isSidebarOpen && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-6 bg-blue-500 rounded-full" />
                  )}
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
          )} asChild>
            <Link href="/api/auth/signout">
              <LogOut className={cn(isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6")} />
              {isSidebarOpen && <span className="font-medium">Keluar Sistem</span>}
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-8 justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {currentMenuItem?.label}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola informasi dan data master</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Cari..." 
                className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Administrator</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Admin Utama</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0b1121] p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
