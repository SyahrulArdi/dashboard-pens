import { NextResponse } from "next/server";
import { validateUserExists } from "@/lib/validate-user";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const role = searchParams.get("role");

  if (!id || !role) {
    return NextResponse.json({ exists: false });
  }

  const exists = await validateUserExists(id, role);
  return NextResponse.json({ exists });
}
