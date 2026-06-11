import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PPKSLayoutClient from "./_components/PPKSLayoutClient";

export default async function PPKSLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ppks") {
    redirect("/login");
  }

  return (
    <PPKSLayoutClient>
      {children}
    </PPKSLayoutClient>
  );
}
