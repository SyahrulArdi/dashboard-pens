import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProfilMahasiswa } from "../actions";
import ProfilTab from "../_components/ProfilTab";

export const dynamic = "force-dynamic";

export default async function MahasiswaProfilPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const profil = await getProfilMahasiswa(userId);

  return <ProfilTab profil={profil} />;
}
