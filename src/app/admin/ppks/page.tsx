import { getPPKS } from "../actions";
import PPKSTab from "../_components/PPKSTab";

export const dynamic = "force-dynamic";

export default async function AdminPPKSPage() {
  const ppks = await getPPKS();

  return <PPKSTab initialData={ppks} />;
}
