import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getNilaiMahasiswa } from "../actions";
import NilaiTab from "../_components/NilaiTab";

export const dynamic = "force-dynamic";

export default async function MahasiswaNilaiPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const nilai = await getNilaiMahasiswa(userId);

  return <NilaiTab nilai={nilai} />;
}
