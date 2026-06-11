"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function AutoLogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-slate-400 text-sm">Sesi tidak valid, mengarahkan ke halaman login...</p>
      </div>
    </div>
  );
}
