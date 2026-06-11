import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { validateUserExists } from "@/lib/validate-user";
import AdminLayoutClient from "./_components/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session || role !== "admin") {
    redirect("/login");
  }

  const exists = await validateUserExists(userId, role);
  if (!exists) {
    redirect("/auto-logout");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
