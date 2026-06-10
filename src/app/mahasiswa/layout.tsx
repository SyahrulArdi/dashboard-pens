import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MahasiswaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-blue-600 text-white h-16 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-xl font-bold">Portal Mahasiswa</h1>
        </div>
        <Button variant="outline" className="text-slate-900 border-none" asChild>
          <Link href="/api/auth/signout">Logout</Link>
        </Button>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
