import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MahasiswaDashboardClient from "./_components/MahasiswaDashboardClient";
import { getProfilMahasiswa, getNilaiMahasiswa, getPresensiMahasiswa, getRiwayatKRS } from "./actions";

export const dynamic = "force-dynamic";

export default async function MahasiswaDashboard() {
  const session = await getServerSession(authOptions);
  
  const userRoles = (session?.user as any)?.roles || {};
  const mhsUser = userRoles["mahasiswa"];
  
  if (!mhsUser) {
    redirect("/login");
  }

  const mahasiswaId = mhsUser.id;

  const [profil, nilai, presensi, krs] = await Promise.all([
    getProfilMahasiswa(mahasiswaId),
    getNilaiMahasiswa(mahasiswaId),
    getPresensiMahasiswa(mahasiswaId),
    getRiwayatKRS(mahasiswaId),
  ]);

  return (
    <MahasiswaDashboardClient 
      profil={profil}
      nilai={nilai}
      presensi={presensi}
      krs={krs}
    />
  );
}
