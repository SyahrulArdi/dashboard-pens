import { getDosenWali } from "../actions";
import DosenTab from "../_components/DosenTab";

export const dynamic = "force-dynamic";

export default async function AdminDosenPage() {
  const dosen = await getDosenWali();

  return <DosenTab initialData={dosen} />;
}
