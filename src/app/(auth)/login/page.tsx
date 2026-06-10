"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password,
    });

    if (result?.error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Email atau Password salah. Silakan coba lagi.",
      });
      return;
    }

    // Login berhasil — tentukan target dashboard dari email
    const lowerEmail = email.toLowerCase().trim();
    let targetUrl = "/";

    if (lowerEmail.endsWith("@admin.pens.ac.id")) {
      targetUrl = "/admin";
    } else if (lowerEmail.includes("student.pens.ac.id")) {
      targetUrl = "/mahasiswa";
    } else if (lowerEmail.endsWith("@ppks.pens.ac.id")) {
      targetUrl = "/ppks";
    } else if (lowerEmail.endsWith("@pens.ac.id")) {
      targetUrl = "/dosenwali";
    }

    toast({
      title: "Login Berhasil",
      description: "Mengarahkan ke dashboard...",
    });

    // Full page navigation agar cookie JWT terbaca middleware
    window.location.assign(targetUrl);
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
