import { getMataKuliah } from "../actions";
import MatkulTab from "../_components/MatkulTab";

export const dynamic = "force-dynamic";

export default async function AdminMatkulPage() {
  const matkul = await getMataKuliah();

  return <MatkulTab initialData={matkul} />;
}
