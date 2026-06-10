"use client";

import Image from "next/image";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ambil sesi yang sedang aktif (untuk fitur multi-role)
    const { getSession } = await import("next-auth/react");
    const currentSession = await getSession();
    const existingRoles = (currentSession?.user as any)?.roles || {};

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      existingRoles: JSON.stringify(existingRoles),
    });

    if (result?.error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Identitas atau Password salah. Silakan coba lagi.",
      });
      return;
    }

    // Login berhasil — tentukan role dari email
    // Gunakan email input langsung karena session baru mungkin belum tersedia di client
    const lowerEmail = email.toLowerCase();
    let targetRole = "";

    if (lowerEmail.endsWith("@admin.pens.ac.id")) {
      targetRole = "admin";
    } else if (lowerEmail.includes("student.pens.ac.id")) {
      targetRole = "mahasiswa";
    } else if (lowerEmail.endsWith("@ppks.pens.ac.id")) {
      targetRole = "ppks";
    } else if (lowerEmail.endsWith("@pens.ac.id")) {
      targetRole = "dosen_wali";
    }

    toast({
      title: "Login Berhasil",
      description: `Mengarahkan ke dasbor...`,
    });

    // Gunakan window.location.href untuk navigasi penuh
    // agar cookie JWT terbaru terbaca oleh middleware
    if (targetRole === "admin") {
      window.location.href = "/admin";
    } else if (targetRole === "dosen_wali") {
      window.location.href = "/dosenwali";
    } else if (targetRole === "mahasiswa") {
      window.location.href = "/mahasiswa";
    } else if (targetRole === "ppks") {
      window.location.href = "/ppks";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#0b668b]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <Image 
                src="/logo.png" 
                alt="Logo Politeknik Elektronika Negeri Surabaya" 
                fill 
                className="object-contain drop-shadow-md" 
                priority
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sistem Akademik Terpadu</CardTitle>
          <CardDescription>
            Login untuk Admin, Dosen Wali, Mahasiswa, atau PPKS
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Masukkan email Anda" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#0b668b] hover:bg-[#004e71]" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
