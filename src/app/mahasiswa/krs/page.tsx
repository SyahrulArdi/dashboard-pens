import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProfilMahasiswa, getRiwayatKRS } from "../actions";
import KRSTab from "../_components/KRSTab";

export const dynamic = "force-dynamic";

export default async function MahasiswaKRSPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const [profil, krs] = await Promise.all([
    getProfilMahasiswa(userId),
    getRiwayatKRS(userId),
  ]);

  return <KRSTab profil={profil} krs={krs} />;
}
