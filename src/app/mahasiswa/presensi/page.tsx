import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPresensiMahasiswa } from "../actions";
import PresensiTab from "../_components/PresensiTab";

export const dynamic = "force-dynamic";

export default async function MahasiswaPresensiPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const presensi = await getPresensiMahasiswa(userId);

  return <PresensiTab presensi={presensi} />;
}
