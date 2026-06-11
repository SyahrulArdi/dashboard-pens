import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./_components/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "admin") {
    redirect("/login");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
