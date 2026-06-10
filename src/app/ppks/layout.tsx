import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PPKSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-orange-600 text-white h-16 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          <h1 className="text-xl font-bold">Portal Tim PPKS</h1>
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
