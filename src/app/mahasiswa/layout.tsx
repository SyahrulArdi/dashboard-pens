import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { validateUserExists } from "@/lib/validate-user";
import MahasiswaLayoutClient from "./_components/MahasiswaLayoutClient";
import { getProfilMahasiswa } from "./actions";

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "mahasiswa") {
    redirect("/login");
  }

  const exists = await validateUserExists(userId, role);
  if (!exists) {
    redirect("/auto-logout");
  }

  const profil = await getProfilMahasiswa(userId);

  if (!profil) {
    redirect("/auto-logout");
  }

  return (
    <MahasiswaLayoutClient profil={profil}>
      {children}
    </MahasiswaLayoutClient>
  );
}
